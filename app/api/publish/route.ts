import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// export const dynamic = 'force-dynamic'  
export const dynamic = 'force-dynamic'
// export const revalidate = 0            
export const revalidate = 0

// CONSTANTE DE LIMITE 
const MAX_LISTINGS_PER_USER = 5

// Fonction pour vérifier la configuration Cloudinary
function isCloudinaryConfigured(): boolean {
  const hasConfig = !!(
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET
  );
  
  if (!hasConfig) {
    console.warn('⚠️ Cloudinary non configuré - fallback vers base64');
    console.warn('   Vérifiez vos variables CLOUDINARY_* dans .env.local');
  }
  
  return hasConfig;
}

// Fonction d'upload améliorée
async function uploadImage(imageData: any, index: number, bienId?: string): Promise<string> {
  try {
    console.log(`📤 Traitement image ${index + 1}:`, {
      type: typeof imageData,
      isFile: imageData instanceof File,
      isString: typeof imageData === 'string',
      length: typeof imageData === 'string' ? imageData.length : 'N/A'
    });

    // CAS 1: C'est déjà une URL (string)
    if (typeof imageData === 'string') {
      // Si c'est déjà une URL valide
      if (imageData.startsWith('http') || imageData.startsWith('https') || imageData.startsWith('data:')) {
        console.log(`✅ Image ${index + 1}: URL déjà existante`);
        return imageData;
      }
      // Si c'est base64
      else if (imageData.includes('base64')) {
        console.log(`✅ Image ${index + 1}: Base64 détecté`);
        return imageData;
      }
    }
    
    // CAS 2: C'est un objet File
    if (imageData instanceof File) {
      const buffer = Buffer.from(await imageData.arrayBuffer());
      
      if (!isCloudinaryConfigured()) {
        const base64 = buffer.toString('base64');
        return `data:${imageData.type};base64,${base64}`;
      }
      
      try {
        const { uploadBufferToCloudinary } = await import('@/lib/cloudinary');
        return await uploadBufferToCloudinary(buffer, {
          filename: imageData.name,
          index: index,
          bienId: bienId
        });
      } catch (error: any) {
        console.error('❌ Erreur Cloudinary:', error.message);
        const base64 = buffer.toString('base64');
        return `data:${imageData.type};base64,${base64}`;
      }
    }
    
    // Dernier recours : placeholder
    console.warn(`⚠️ Image ${index + 1}: format non supporté, placeholder utilisé`);
    return 'https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin';
    
  } catch (error: any) {
    console.error(`❌ Erreur upload image ${index + 1}:`, error.message);
    return 'https://via.placeholder.com/800x600/cccccc/969696?text=Erreur+Image';
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 Début publication...');
  
  try {
    console.log('🔧 Configuration Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configuré' : '❌ Manquant',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅ Configuré' : '❌ Manquant',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ (présent)' : '❌ Manquant',
    });
    
    const formData = await request.formData();
    const dataString = formData.get('data') as string;
    const data = JSON.parse(dataString);
    
    // ============ VÉRIFICATION DE LA LIMITE ============
    const ownerEmail = data.onboarding?.email;
    if (ownerEmail) {
      console.log(`🔍 Vérification limite pour: ${ownerEmail}`);
      
      try {
        // Trouver l'utilisateur
        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email: ownerEmail },
          select: { id: true }
        });
        
        let count = 0;
        if (utilisateur) {
          // S'il existe compter les annonces de l'utilisateur
          count = await prisma.bien.count({
            where: {
              proprietaireId: utilisateur.id
            }
          });
        }
        
        console.log(`📊 Annonces actuelles: ${count} / ${MAX_LISTINGS_PER_USER}`);
        
        // Vérifier si la limite est atteinte
        if (count >= MAX_LISTINGS_PER_USER) {
          return NextResponse.json({
            success: false,
            error: `LIMIT_REACHED: Vous avez déjà ${count} annonces. La limite est de ${MAX_LISTINGS_PER_USER} annonces par propriétaire.`,
            limitReached: true,
            currentCount: count,
            maxLimit: MAX_LISTINGS_PER_USER
          }, { status: 403 });
        }
        
        console.log(`✅ Limite OK: ${count + 1}/${MAX_LISTINGS_PER_USER}`);
      } catch (countError) {
        console.warn('⚠️ Erreur vérification limite, continue:', countError);
      }
    }
    // ============ FIN DE LA VÉRIFICATION DE LIMITE ============
    
    // NOUVELLE SECTION : Récupération et traitement des photos
    const photoEntries = formData.getAll('photos');
    console.log('📤 Photos reçues (toutes):', photoEntries.length);
    
    // Traiter TOUTES les entrées
    const imagePromises: Promise<string>[] = [];

    for (let i = 0; i < photoEntries.length; i++) {
      const entry = photoEntries[i];
      
      if (typeof entry === 'string') {
        // Cas 1: C'est déjà une URL (Cloudinary, HTTPS, ou base64)
        console.log(`📷 Photo ${i + 1}: String (${entry.length} caractères)`);
        
        if (entry.startsWith('http') || entry.startsWith('https') || entry.startsWith('data:')) {
          // URL déjà valide, l'utiliser directement
          imagePromises.push(Promise.resolve(entry));
        } else {
          // Autre type de string, considérer comme URL Cloudinary
          imagePromises.push(Promise.resolve(entry));
        }
      } 
      else if (entry instanceof File) {
        // Cas 2: C'est un File, le traiter normalement
        console.log(`📷 Photo ${i + 1}: File (${entry.name}, ${entry.size} bytes)`);
        // CORRECTION : Passer undefined au lieu de null si pas de bienId
        imagePromises.push(uploadImage(entry, i, undefined));
      }
      else {
        // Cas 3: Type inconnu, ignorer
        console.warn(`⚠️ Photo ${i + 1}: Type non supporté (${typeof entry})`);
      }
    }
    
    console.log('\n📤 Publication - Informations:');
    console.log('  • Titre:', data.title);
    console.log('  • Catégorie:', data.housingType?.category);
    console.log('  • Ville:', data.location?.city);
    console.log('  • Photos reçues:', photoEntries.length);
    console.log('  • Photos traitées:', imagePromises.length);
    
    console.log('  • Cloudinary:', isCloudinaryConfigured() ? '✅ ACTIF' : '❌ INACTIF (base64)');
    console.log('  • Limite:', `${MAX_LISTINGS_PER_USER} annonces max`);

    // Créer un tableau d'URLs placeholder temporaires
    const placeholderUrls = imagePromises.length > 0 
      ? Array(imagePromises.length).fill('https://via.placeholder.com/800x600/cccccc/969696?text=Chargement...')
      : ['https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin'];

    console.log('📝 Création du bien...');
    
    const bienDataTemp: any = {
      // Informations de base
      title: data.title || 'Nouveau bien',
      category: data.housingType?.category || 'HOUSE',
      subType: data.housingType?.subType || 'Appartement',
      privacy: data.housingType?.privacy || null,
      
      // Localisation
      country: data.location?.country || 'Bénin',
      city: data.location?.city || 'Cotonou',
      neighborhood: data.location?.neighborhood || '',
      address: data.location?.address || 'Adresse non spécifiée',
      postalCode: data.location?.postalCode || '',
      latitude: data.location?.latitude ? parseFloat(data.location.latitude) : null,
      longitude: data.location?.longitude ? parseFloat(data.location.longitude) : null,
      
      // Caractéristiques communes
      size: data.basics?.size ? parseInt(data.basics.size) : null,
      floors: data.basics?.floors ? parseInt(data.basics.floors) : null,
      
      // Champs spécifiques maison
      maxGuests: data.basics?.maxGuests ? parseInt(data.basics.maxGuests) : null,
      bedrooms: data.basics?.bedrooms ? parseInt(data.basics.bedrooms) : null,
      beds: data.basics?.beds ? parseInt(data.basics.beds) : null,
      bathrooms: data.basics?.bathrooms ? parseInt(data.basics.bathrooms) : null,
      privateEntrance: data.basics?.privateEntrance || false,
      
      // Champs spécifiques bureau
      employees: data.basics?.employees ? parseInt(data.basics.employees) : null,
      offices: data.basics?.offices ? parseInt(data.basics.offices) : null,
      meetingRooms: data.basics?.meetingRooms ? parseInt(data.basics.meetingRooms) : null,
      workstations: data.basics?.workstations ? parseInt(data.basics.workstations) : null,
      
      // Champs spécifiques événement
      eventCapacity: data.basics?.eventCapacity ? parseInt(data.basics.eventCapacity) : null,
      parkingSpots: data.basics?.parkingSpots ? parseInt(data.basics.parkingSpots) : null,
      wheelchairAccessible: data.basics?.wheelchairAccessible || false,
      hasStage: data.basics?.hasStage || false,
      hasSoundSystem: data.basics?.hasSoundSystem || false,
      hasProjector: data.basics?.hasProjector || false,
      hasCatering: data.basics?.hasCatering || false,
      minBookingHours: data.basics?.minBookingHours ? parseInt(data.basics.minBookingHours) : null,
      
      // Prix
      basePrice: data.price?.basePrice ? parseFloat(data.price.basePrice) : null,
      currency: data.price?.currency || 'FCFA',
      weeklyDiscount: data.price?.weeklyDiscount ? parseFloat(data.price.weeklyDiscount) : 0,
      monthlyDiscount: data.price?.monthlyDiscount ? parseFloat(data.price.monthlyDiscount) : 0,
      cleaningFee: data.price?.cleaningFee ? parseFloat(data.price.cleaningFee) : 0,
      extraGuestFee: data.price?.extraGuestFee ? parseFloat(data.price.extraGuestFee) : 0,
      securityDeposit: data.price?.securityDeposit ? parseFloat(data.price.securityDeposit) : 0,
      
      // Règles
      checkInTime: data.rules?.checkInTime || '15:00',
      checkOutTime: data.rules?.checkOutTime || '11:00',
      childrenAllowed: data.rules?.childrenAllowed !== false,
      
      // Images temporaires (placeholders)
      images: placeholderUrls,
      
      // Propriétaire
      proprietaire: {
        connectOrCreate: {
          where: { email: data.onboarding?.email || 'default@example.com' },
          create: {
            telephone: data.onboarding?.telephone || '00000000',
            email: data.onboarding?.email || 'default@example.com',
            nom: data.onboarding?.nom || 'Propriétaire Test',
          }
        }
      },
      
      // Statut temporaire
      isPublished: false,
    };

    // Créer le bien temporairement
    const bienTemporaire = await prisma.bien.create({
      data: bienDataTemp
    });

    console.log(`✅ Bien temporaire créé avec ID: ${bienTemporaire.id}`);

    // Upload des images avec l'ID du bien
    console.log('📤 Début upload des images...');
    
    let imageUrls: string[] = [];
    
    if (imagePromises.length > 0) {
      // Maintenant qu'on a l'ID du bien, on peut uploader les images qui en ont besoin
      const finalPromises = imagePromises.map(async (promise, index) => {
        console.log(`\n📤 Traitement ${index + 1}/${imagePromises.length}:`);
        
        const url = await promise;
        
        // Si c'est déjà une URL Cloudinary ou HTTPS, la garder
        if (url.includes('cloudinary.com') || url.startsWith('https://')) {
          console.log(`   ✅ URL Cloudinary/HTTPS: ${url.substring(0, 60)}...`);
          return url;
        }
        
        // Si c'est base64 ou placeholder, essayer d'uploader à Cloudinary
        if (url.startsWith('data:') || url.includes('placeholder.com')) {
          try {
            if (isCloudinaryConfigured()) {
              const { uploadBufferToCloudinary } = await import('@/lib/cloudinary');
              
              if (url.startsWith('data:')) {
                // Convertir base64 en buffer
                const base64Data = url.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const cloudinaryUrl = await uploadBufferToCloudinary(buffer, {
                  filename: `image_${index + 1}.jpg`,
                  index: index,
                  bienId: bienTemporaire.id.toString()
                });
                console.log(`   ✅ Base64 uploadé vers Cloudinary`);
                return cloudinaryUrl;
              }
            }
          } catch (error: any) {
            console.error(`   ❌ Erreur upload: ${error.message}`);
          }
        }
        
        // Sinon garder l'URL originale
        return url;
      });

      imageUrls = await Promise.all(finalPromises);
    } else {
      console.log('ℹ️ Aucune photo à traiter');
      imageUrls = placeholderUrls;
    }

    // Vérifier les doublons
    const uniqueUrls = [...new Set(imageUrls)];
    if (uniqueUrls.length !== imageUrls.length) {
      console.warn(`⚠️ ATTENTION: ${imageUrls.length - uniqueUrls.length} doublon(s) détecté(s)!`);
    }

    console.log(`\n📊 RÉSUMÉ UPLOAD:`);
    console.log(`✅ Total uploadées: ${imageUrls.length} images`);
    console.log(`🎯 Uniques: ${uniqueUrls.length} images`);
    
    if (imageUrls.length > 0) {
      console.log(`📸 URLs générées:`);
      imageUrls.forEach((url, index) => {
        const displayUrl = url.length > 70 ? url.substring(0, 70) + '...' : url;
        console.log(`   ${index + 1}. ${displayUrl}`);
      });
    }

    if (imageUrls.length === 0) {
      console.warn('⚠️ Aucune image traitée - ajout placeholder');
      imageUrls.push('https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin');
    }

    // Mettre à jour le bien avec les images réelles
    console.log(`\n🔄 Mise à jour du bien ${bienTemporaire.id} avec les images...`);
    
    const bienFinal = await prisma.bien.update({
      where: { id: bienTemporaire.id },
      data: {
        images: imageUrls,
        isPublished: true
      }
    });

    console.log(`✅ Bien finalisé avec ID: ${bienFinal.id}`);
    
    // Créer la description
    if (data.description?.summary) {
      try {
        await prisma.description.create({
          data: {
            summary: data.description.summary || '',
            spaceDescription: data.description.spaceDescription || '',
            guestAccess: data.description.guestAccess || '',
            neighborhoodInfo: data.description.neighborhood || '',
            bienId: bienFinal.id
          }
        });
        console.log(`📝 Description créée pour le bien ${bienFinal.id}`);
      } catch (descError: any) {
        console.error('⚠️ Erreur description (non critique):', descError.message);
      }
    }
    
    // AJOUT DES ÉQUIPEMENTS
    if (data.amenities && Array.isArray(data.amenities)) {
      console.log(`🔧 Ajout de ${data.amenities.length} équipement(s)`);
      console.log('📋 Équipements reçus:', data.amenities);
      
      try {
        const allEquipements = await prisma.equipement.findMany({
          select: { id: true, nom: true, code: true }
        });
        
        console.log('📋 Équipements disponibles en base:', allEquipements.length);
        
        const addedEquipements: string[] = [];
        const notFoundEquipements: string[] = [];
        
        // Mapping des noms communs
        const commonMappings: Record<string, string> = {
          'wifi': 'wifi_house',
          'wi-fi': 'wifi_house',
          'Wi-Fi': 'wifi_house',
          'climatisation': 'air_conditioning',
          'Climatisation': 'air_conditioning',
          'air conditionné': 'air_conditioning',
          'piscine': 'swimming_pool',
          'Piscine': 'swimming_pool',
          'jardin': 'garden',
          'Jardin': 'garden',
          'parking': 'parking_house',
          'Parking': 'parking_house',
          'terrasse': 'terrace',
          'Terrasse': 'terrace',
          'balcon': 'balcony',
          'Balcon': 'balcony',
          'cuisine': 'kitchen_full',
          'Cuisine': 'kitchen_full',
          'machine à laver': 'washing_machine',
          'Machine à laver': 'washing_machine',
          'tv': 'tv_streaming',
          'TV': 'tv_streaming',
          'télévision': 'tv_streaming',
          'ascenseur': 'elevator',
          'Ascenseur': 'elevator',
          'internet': 'wifi_house',
          'air conditioning': 'air_conditioning',
          'swimming pool': 'swimming_pool',
          'terrace': 'terrace',
          'balcony': 'balcony',
          'kitchen': 'kitchen_full',
          'washing machine': 'washing_machine',
          'television': 'tv_streaming',
          'elevator': 'elevator',
          'fibre optique': 'high_speed_wifi',
          'visioconférence': 'video_conference',
          'projecteur': 'projector_hd',
          'imprimante': 'printer_scanner',
          'sono': 'sound_system',
          'micro': 'wireless_mics',
          'scène': 'stage',
          'piste de danse': 'dance_floor'
        };
        
        for (const amenityInput of data.amenities) {
          try {
            const normalizedInput = amenityInput.trim();
            let equipement = null;
            
            // Chercher par code
            equipement = allEquipements.find(e => 
              e.code.toLowerCase() === normalizedInput.toLowerCase()
            );
            
            // Chercher par nom
            if (!equipement) {
              equipement = allEquipements.find(e => 
                e.nom.toLowerCase() === normalizedInput.toLowerCase()
              );
            }
            
            // Mapping
            if (!equipement && commonMappings[normalizedInput.toLowerCase()]) {
              const mappedCode = commonMappings[normalizedInput.toLowerCase()];
              equipement = allEquipements.find(e => e.code === mappedCode);
            }
            
            if (equipement) {
              const existingLink = await prisma.equipementBien.findFirst({
                where: { bienId: bienFinal.id, equipementId: equipement.id }
              });
              
              if (!existingLink) {
                await prisma.equipementBien.create({
                  data: { bienId: bienFinal.id, equipementId: equipement.id }
                });
                addedEquipements.push(equipement.nom);
              }
            } else {
              notFoundEquipements.push(normalizedInput);
            }
          } catch (error: any) {
            console.error(`⚠️ Erreur avec équipement ${amenityInput}:`, error.message);
          }
        }
        
        console.log(`\n📊 RÉSUMÉ ÉQUIPEMENTS:`);
        console.log(`✅ ${addedEquipements.length} équipement(s) ajouté(s)`);
        if (notFoundEquipements.length > 0) {
          console.log(`❌ ${notFoundEquipements.length} équipement(s) non trouvé(s):`, notFoundEquipements);
        }
      } catch (error: any) {
        console.error('⚠️ Erreur lors de l\'ajout des équipements:', error.message);
      }
    }

    console.log('\n🎉 PUBLICATION RÉUSSIE !');
    console.log(`📊 Récapitulatif:`);
    console.log(`   • ID: ${bienFinal.id}`);
    console.log(`   • Titre: ${bienFinal.title}`);
    console.log(`   • Catégorie: ${bienFinal.category}`);
    console.log(`   • Images: ${imageUrls.length}`);
    console.log(`   • Cloudinary: ${isCloudinaryConfigured() ? 'Utilisé' : 'Base64'}`);
    console.log(`   • Limite respectée: ✅`);

    return NextResponse.json({
      success: true,
      message: 'Bien publié avec succès',
      data: { 
        id: bienFinal.id,
        title: bienFinal.title,
        imagesCount: imageUrls.length,
        category: bienFinal.category,
        cloudinaryUsed: isCloudinaryConfigured()
      }
    });
    
  } catch (error: any) {
    console.error('❌ ERREUR DÉTAILLÉE publication:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    
    let errorMessage = 'Erreur lors de la publication';
    let statusCode = 500;
    
    if (error.message.includes('Unique constraint')) {
      errorMessage = 'Un propriétaire avec cet email existe déjà.';
      statusCode = 409;
    } else if (error.message.includes('Foreign key constraint')) {
      errorMessage = 'Erreur de référence (propriétaire non trouvé).';
      statusCode = 400;
    } else if (error.message.includes('cloud_name')) {
      errorMessage = 'Cloudinary non configuré. Images sauvegardées en local.';
      statusCode = 500;
    } else if (error.message.includes('arrayBuffer is not a function')) {
      errorMessage = 'Erreur dans le traitement des images. Veuillez réessayer.';
      statusCode = 400;
    } else if (error.message.includes('prisma')) {
      errorMessage = 'Erreur base de données. Veuillez réessayer.';
      statusCode = 500;
    } else if (error.message.includes('LIMIT_REACHED')) {
      errorMessage = error.message.replace('LIMIT_REACHED: ', '');
      statusCode = 403;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}