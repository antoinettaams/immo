import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// ✅ CONFIGURATION DU VIEWPORT
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ✅ CONFIGURATION DES MÉTADONNÉES
export const metadata: Metadata = {
  // 1. Corrige l'erreur "metadataBase property is not set"
  metadataBase: new URL('https://immo-benin.com'),

  title: 'ImmoBenin - Louez ou proposez des espaces au Bénin',
  description: "Maisons, appartements meublés, bureaux, salles d'événements ou terrains. Trouvez l'endroit idéal ou rentabilisez le vôtre.",
  keywords: 'location Bénin, maison à louer Cotonou, bureau Porto-Novo, salle événement, terrain',
  authors: [{ name: 'ImmoBenin' }],
  creator: 'ImmoBenin',
  publisher: 'ImmoBenin',

  // 2. CONFIGURATION DU LOGO DANS L'ONGLET (Favicon)
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png', // Pour l'affichage sur iPhone/Safari
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://immo-benin.com',
  },
  openGraph: {
    title: 'ImmoBenin',
    description: 'Location de propriétés au Bénin',
    url: 'https://immo-benin.com',
    siteName: 'ImmoBenin',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Logo ImmoBenin',
      },
    ],
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
        {/* Google Analytics */}
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
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 font-sans selection:bg-brand selection:text-white`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}