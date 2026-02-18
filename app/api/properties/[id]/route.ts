import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// export const dynamic = 'force-dynamic'  
export const dynamic = 'force-dynamic'
// export const revalidate = 0            
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      );
    }

    console.log(`🔍 Récupération bien ID: ${propertyId}`);

    const property = await prisma.bien.findUnique({
      where: { 
        id: propertyId,
        isPublished: true 
      },
      include: {
        description: true,
        proprietaire: true,
        equipements: {
          include: {
            equipement: true
          }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Propriété non trouvée' },
        { status: 404 }
      );
    }

    console.log(`✅ Bien trouvé: "${property.title}"`);
    console.log('📋 Champs disponibles depuis la base:');
    console.log('  • id:', property.id);
    console.log('  • title:', property.title);
    console.log('  • category:', property.category);
    console.log('  • subType:', property.subType);
    console.log('  • basePrice:', property.basePrice);
    console.log('  • beds:', property.beds, '(type:', typeof property.beds, ')');
    console.log('  • offices:', property.offices, '(type:', typeof property.offices, ')');
    console.log('  • meetingRooms:', property.meetingRooms);
    console.log('  • workstations:', property.workstations);
    console.log('  • hasStage:', property.hasStage, '(type:', typeof property.hasStage, ')');
    console.log('  • hasSoundSystem:', property.hasSoundSystem);
    console.log('  • hasProjector:', property.hasProjector);
    console.log('  • hasCatering:', property.hasCatering);
    console.log('  • postalCode:', property.postalCode);
    console.log('  • latitude:', property.latitude);
    console.log('  • longitude:', property.longitude);
    console.log('  • weeklyDiscount:', property.weeklyDiscount);
    console.log('  • monthlyDiscount:', property.monthlyDiscount);
    console.log('  • cleaningFee:', property.cleaningFee);
    console.log('  • extraGuestFee:', property.extraGuestFee);
    console.log('  • securityDeposit:', property.securityDeposit);

    // Déterminer la capacité selon la catégorie
    let capacity = 0;
    if (property.category === 'HOUSE') {
      capacity = property.maxGuests || 0;
    } else if (property.category === 'OFFICE') {
      capacity = property.employees || 0;
    } else if (property.category === 'EVENT') {
      capacity = property.eventCapacity || 0;
    }

    // Extraire les équipements
    const amenities = property.equipements
      .map(e => e.equipement?.nom)
      .filter((nom): nom is string => !!nom);
    
    const hasWifi = amenities.some(amenity => 
      amenity.toLowerCase().includes('wifi') || 
      amenity.toLowerCase().includes('internet')
    );

    // Format display type
    let displayType = '';
    switch (property.category) {
      case 'HOUSE':
        displayType = property.subType && property.subType !== 'house' 
          ? property.subType.charAt(0).toUpperCase() + property.subType.slice(1)
          : 'Maison';
        break;
      case 'OFFICE':
        displayType = property.subType && property.subType !== 'office'
          ? property.subType.charAt(0).toUpperCase() + property.subType.slice(1)
          : 'Bureau';
        break;
      case 'EVENT':
        displayType = property.subType && property.subType !== 'event'
          ? property.subType.charAt(0).toUpperCase() + property.subType.slice(1)
          : 'Salle événement';
        break;
      default:
        displayType = property.subType || 'Propriété';
    }

    // TRAITEMENT DES IMAGES
    const cleanImages = (property.images || [])
      .filter((img: any) => {
        if (!img || typeof img !== 'string') {
          return false;
        }
        
        const trimmed = img.trim();
        
        // Exclure URLs blob (temporaires)
        if (trimmed.startsWith('blob:')) {
          return false;
        }
        
        return true;
      })
      .map((img: string) => {
        const trimmed = img.trim();
        
        // Si c'est base64 (très long)
        if (trimmed.startsWith('data:image/') && trimmed.includes('base64')) {
          // Si trop long, remplacer par placeholder
          if (trimmed.length > 500000) { // ~500KB
            return 'https://via.placeholder.com/800x600/cccccc/969696?text=Image+non+disponible';
          }
          return trimmed;
        }
        
        // Nettoyer URLs Cloudinary
        if (trimmed.includes('cloudinary.com')) {
          let cleanUrl = trimmed;
          
          // Forcer HTTPS
          if (cleanUrl.startsWith('http://')) {
            cleanUrl = cleanUrl.replace('http://', 'https://');
          }
          
          // Ajouter optimisation d'image
          if (!cleanUrl.includes('/upload/q_auto,f_auto/') && cleanUrl.includes('/upload/')) {
            cleanUrl = cleanUrl.replace('/upload/', '/upload/q_auto,f_auto/');
          }
          
          return cleanUrl;
        }
        
        return trimmed;
      })
      .filter((img: string) => img && img.length > 0);

    // Assurer au moins une image
    const images = cleanImages.length > 0 
      ? cleanImages 
      : ['https://via.placeholder.com/800x600/cccccc/969696?text=Immobilier+B%C3%A9nin'];

    // FORMATTER LA RÉPONSE COMPLÈTE
    const formattedProperty = {
      // === Informations de base ===
      id: property.id,
      title: property.title || `${displayType} à ${property.city}`,
      type: displayType, // CRITIQUE: doit correspondre au frontend
      category: property.category,
      subType: property.subType,
      privacy: property.privacy,
      displayType: displayType,
      
      // === LocationStep ===
      location: property.neighborhood || property.city,
      city: property.city,
      neighborhood: property.neighborhood,
      address: property.address,
      country: property.country || 'Bénin',
      postalCode: property.postalCode,
      latitude: property.latitude,
      longitude: property.longitude,
      
      // === BasicsStep ===
      // Champs communs
      size: property.size,
      floors: property.floors,
      
      // Champs maison
      maxGuests: property.maxGuests,
      bedrooms: property.bedrooms,
      beds: property.beds || 0,
      bathrooms: property.bathrooms,
      privateEntrance: property.privateEntrance || false,
      
      // Champs bureau
      employees: property.employees,
      offices: property.offices || 0,
      meetingRooms: property.meetingRooms || 0,
      workstations: property.workstations || 0,
      
      // Champs événement
      eventCapacity: property.eventCapacity,
      parkingSpots: property.parkingSpots,
      wheelchairAccessible: property.wheelchairAccessible || false,
      hasStage: property.hasStage === true,
      hasSoundSystem: property.hasSoundSystem === true,
      hasProjector: property.hasProjector === true,
      hasCatering: property.hasCatering === true,
      minBookingHours: property.minBookingHours || 0,
      
      // === PriceStep ===
      price: property.basePrice || 0, // CRITIQUE: le frontend cherche 'price'
      basePrice: property.basePrice || 0,
      currency: property.currency || 'FCFA',
      weeklyDiscount: property.weeklyDiscount || 0,
      monthlyDiscount: property.monthlyDiscount || 0,
      cleaningFee: property.cleaningFee || 0,
      extraGuestFee: property.extraGuestFee || 0,
      securityDeposit: property.securityDeposit || 0,
      
      // === Rules ===
      checkInTime: property.checkInTime || '15:00',
      checkOutTime: property.checkOutTime || '11:00',
      childrenAllowed: property.childrenAllowed !== false,
      
      // === Images ===
      img: images[0] || '',
      images: images,
      
      // Information sur les images
      _imageInfo: {
        count: images.length,
        hasBase64: images.some(img => img.startsWith('data:image/')),
      },
      
      // === DescriptionStep ===
      description: property.description ? {
        summary: property.description.summary || '',
        spaceDescription: property.description.spaceDescription || '',
        guestAccess: property.description.guestAccess || '',
        neighborhoodInfo: property.description.neighborhoodInfo || '',
        createdAt: property.description.createdAt?.toISOString(),
      } : null,
      
      // === AmenitiesStep ===
      wifi: hasWifi,
      amenities: amenities,
      amenitiesDetails: property.equipements.map(e => ({
        id: e.equipement.id,
        code: e.equipement.code,
        nom: e.equipement.nom,
        description: e.equipement.description || '',
        categorie: e.equipement.categorie,
        pourMaison: e.equipement.pourMaison,
        pourBureau: e.equipement.pourBureau,
        pourEvenement: e.equipement.pourEvenement,
      })),
      
      // === Utilisateur ===
      owner: {
        id: property.proprietaire.id,
        name: property.proprietaire.nom,
        phone: property.proprietaire.telephone,
        email: property.proprietaire.email,
        createdAt: property.proprietaire.createdAt?.toISOString(),
      },
      
      // === Features calculées ===
      capacity: capacity,
      features: {
        hasPool: amenities.some(a => a.toLowerCase().includes('piscine')),
        hasAirConditioning: amenities.some(a => a.toLowerCase().includes('climatisation')),
        hasParking: amenities.some(a => a.toLowerCase().includes('parking')),
        hasKitchen: amenities.some(a => a.toLowerCase().includes('cuisine')),
        hasTerrace: amenities.some(a => a.toLowerCase().includes('terrasse') || a.toLowerCase().includes('balcon')),
      },
      
      // === Métadonnées ===
      isPublished: property.isPublished,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
      
      // === Groupement pour compatibilité ===
      rules: {
        checkInTime: property.checkInTime || '15:00',
        checkOutTime: property.checkOutTime || '11:00',
        childrenAllowed: property.childrenAllowed !== false,
      },
      
      pricing: {
        basePrice: property.basePrice || 0,
        currency: property.currency || 'FCFA',
        weeklyDiscount: property.weeklyDiscount || 0,
        monthlyDiscount: property.monthlyDiscount || 0,
        cleaningFee: property.cleaningFee || 0,
        extraGuestFee: property.extraGuestFee || 0,
        securityDeposit: property.securityDeposit || 0,
      },
    };

    console.log(`\n✅ Propriété ${propertyId} formatée avec succès`);
    console.log(`📸 Images: ${images.length}`);
    console.log(`🏠 Chambres: ${property.bedrooms}`);
    console.log(`🛏️ Lits: ${formattedProperty.beds}`);
    console.log(`🚿 Salles de bain: ${property.bathrooms}`);
    console.log(`💰 Prix: ${formattedProperty.price} ${formattedProperty.currency}`);
    console.log(`📦 Taille de la réponse: ${JSON.stringify(formattedProperty).length} caractères`);
    
    console.log('\n🔍 VÉRIFICATION FINALE API [id]:');
    console.log('  • type:', formattedProperty.type);
    console.log('  • price:', formattedProperty.price);
    console.log('  • basePrice:', formattedProperty.basePrice);
    console.log('  • beds:', formattedProperty.beds);
    console.log('  • offices:', formattedProperty.offices);
    console.log('  • hasStage:', formattedProperty.hasStage);
    console.log('  • weeklyDiscount:', formattedProperty.weeklyDiscount);
    console.log('  • postalCode:', formattedProperty.postalCode);

    return NextResponse.json({
      success: true,
      data: formattedProperty
    });

  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération de la propriété:', error);
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de la récupération de la propriété',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    const body = await request.json();
    
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    const updatedProperty = await prisma.bien.update({
      where: { id: propertyId },
      data: {
        title: body.title,
        basePrice: body.price,
        isPublished: body.isPublished,
        city: body.city,
        address: body.address,
        size: body.size,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        maxGuests: body.maxGuests,
        employees: body.employees,
        eventCapacity: body.eventCapacity,
        beds: body.beds,
        offices: body.offices,
        meetingRooms: body.meetingRooms,
        workstations: body.workstations,
        hasStage: body.hasStage,
        hasSoundSystem: body.hasSoundSystem,
        hasProjector: body.hasProjector,
        hasCatering: body.hasCatering,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Propriété mise à jour',
      data: { id: updatedProperty.id }
    });
    
  } catch (error: any) {
    console.error('❌ Erreur mise à jour propriété:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la mise à jour',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    await prisma.bien.delete({
      where: { id: propertyId }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Propriété supprimée'
    });
    
  } catch (error: any) {
    console.error('❌ Erreur suppression propriété:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la suppression',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}