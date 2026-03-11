// components/sections/HostCTA.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from './Button';
import { Home, Briefcase, Calendar, Users, ArrowRight, Sparkles, Award, TrendingUp } from 'lucide-react';

interface HostCTAProps {
  className?: string;
}

export const HostCTA: React.FC<HostCTAProps> = ({ className = '' }) => {
  const router = useRouter();

  const handleHostClick = () => {
    router.push('/publish');
  };

  const handleLearnMoreClick = () => {
    router.push('/devenir-hote');
  };

  // Types d'espaces qu'on peut louer
  const spaceTypes = [
    { icon: Home, label: "Chambre d'amis", color: "text-blue-600", bg: "bg-blue-100" },
    { icon: Home, label: "Appartement entier", color: "text-green-600", bg: "bg-green-100" },
    { icon: Briefcase, label: "Bureau / Coworking", color: "text-purple-600", bg: "bg-purple-100" },
    { icon: Calendar, label: "Salle d'événement", color: "text-orange-600", bg: "bg-orange-100" },
    { icon: Users, label: "Espace de réunion", color: "text-pink-600", bg: "bg-pink-100" },
    { icon: Home, label: "Studio / Garage", color: "text-indigo-600", bg: "bg-indigo-100" },
  ];

  // Avantages pour l'hôte
  const benefits = [
    {
      icon: TrendingUp,
      title: "Gagnez jusqu'à 250.000 FCFA/mois",
      description: "Rentabilisez votre espace inutilisé en le proposant à notre communauté"
    },
    {
      icon: Sparkles,
      title: "Publication en 5 minutes",
      description: "Processus simple et guidé, avec assistance si besoin"
    },
    {
      icon: Award,
      title: "Visibilité maximale",
      description: "Votre annonce sera vue par des milliers de visiteurs chaque mois"
    }
  ];

  return (
    <section 
      className={`relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-brand/5 via-white to-brand/5 ${className}`}
      aria-labelledby="host-cta-title"
    >
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-full text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Transformez votre espace en revenus</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Colonne gauche : Message principal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 
              id="host-cta-title"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Vous avez un espace inoccupé ?
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Que ce soit une <span className="font-semibold text-brand">chambre d'amis</span>, 
              un <span className="font-semibold text-brand">bureau</span> ou même 
              une <span className="font-semibold text-brand">salle</span> pour vos événements, 
              <span className="block mt-2 text-2xl font-bold text-brand">Transformez-le en revenus !</span>
            </p>

            {/* Grille des types d'espaces */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
              {spaceTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-brand/30 transition-all"
                  >
                    <div className={`p-2 rounded-full ${type.bg} mb-2`}>
                      <Icon className={`w-4 h-4 ${type.color}`} />
                    </div>
                    <span className="text-xs text-center font-medium text-gray-700">{type.label}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Avantages */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="p-2 bg-green-100 rounded-lg shrink-0">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleHostClick}
                size="lg"
                className="group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Commencer la publication
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand to-brand-dark transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Button>
            </div>
          </motion.div>

          {/* Colonne droite : Visuel inspirant */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://i.postimg.cc/sf47ZR4L/Chat-GPT-Image-11-mars-2026-15-11-52.png" // À remplacer par votre image
                alt="Exemple d'espace aménagé pour la location"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Badge de succès */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
              >
                <p className="text-sm font-bold text-gray-900">Marie, Hôte à Cotonou</p>
                <p className="text-xs text-green-600 font-semibold">+150.000 FCFA/mois</p>
              </motion.div>

              {/* Badge de disponibilité */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600 mb-2">
                  "J'avais une chambre inoccupée, maintenant elle me rapporte chaque mois."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Il y a 2 semaines</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    Disponible maintenant
                  </span>
                </div>
              </div>
            </div>

            {/* Éléments flottants */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-brand/10 rounded-full blur-2xl -z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};