import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// ✅ POUR LE RESPONSIVE MOBILE (corrige l'affichage téléphone)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'ImmoBenin - Louez ou proposez des espaces au Bénin',
  description: 'Maisons, appartements meublés, bureaux, salles d\'événements ou terrains. Trouvez l\'endroit idéal ou rentabilisez le vôtre.',
  // ✅ AJOUTE CES LIGNES POUR LE SEO
  keywords: 'location Bénin, maison à louer Cotonou, bureau Porto-Novo, salle événement, terrain',
  authors: [{ name: 'ImmoBenin' }],
  creator: 'ImmoBenin',
  publisher: 'ImmoBenin',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://immo-benin.com',
  },
  
  // ✅ POUR L'IMAGE DANS GOOGLE (Open Graph)
  openGraph: {
    title: 'ImmoBenin - Location au Bénin',
    description: 'Trouvez votre prochain logement ou espace au Bénin',
    url: 'https://immo-benin.com',
    siteName: 'ImmoBenin',
    images: [
      {
        url: '/logo.png', // Votre logo PNG dans public/
        width: 1200,
        height: 630,
        alt: 'ImmoBenin - Location de propriétés au Bénin',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  // ✅ POUR TWITTER (optionnel)
  twitter: {
    card: 'summary_large_image',
    title: 'ImmoBenin',
    description: 'Louez ou proposez des espaces au Bénin',
    images: ['/logo.png'],
  },

  // ✅ POUR L'ONGLET (favicon par défaut)
  icons: {
    icon: '/favicon.ico', // Optionnel
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Google Analytics - Placé directement après head */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EDT735L9C3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EDT735L9C3');
          `}
        </Script>
        
        {/* ✅ META TAGS POUR GOOGLE (renforcés) */}
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="ImmoBenin" />
        <meta name="twitter:image" content="/logo.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 font-sans selection:bg-brand selection:text-white`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}