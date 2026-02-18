import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// ✅ CONFIGURATION DU VIEWPORT (Mobile Responsive)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ✅ CONFIGURATION DES MÉTADONNÉES (SEO + LOGOS)
export const metadata: Metadata = {
  metadataBase: new URL('https://immo-benin.com'),

  title: 'ImmoBenin - Louez ou proposez des espaces au Bénin',
  description: "Maisons, appartements meublés, bureaux, salles d'événements ou terrains. Trouvez l'endroit idéal ou rentabilisez le vôtre.",
  keywords: 'location Bénin, maison à louer Cotonou, bureau Porto-Novo, salle événement, terrain',
  authors: [{ name: 'ImmoBenin' }],
  creator: 'ImmoBenin',
  publisher: 'ImmoBenin',

  // ✅ CONFIGURATION DES ICÔNES - VERSION AMÉLIORÉE AVEC PLUSIEURS TAILLES
  icons: {
    icon: [
      // Petites tailles pour l'onglet
      { url: '/logo-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-64x64.png', sizes: '64x64', type: 'image/png' },
      // Grandes tailles pour les écrans HD
      { url: '/logo-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/logo-192x192.png', sizes: '192x192', type: 'image/png' },
      // Format par défaut (le plus grand)
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/logo-64x64.png',
    apple: [
      { url: '/logo-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/logo.png', sizes: '180x180', type: 'image/png' }, // Fallback
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://immo-benin.com',
  },

  // ✅ POUR LES RÉSEAUX SOCIAUX - UTILISE UNE GRANDE IMAGE
  openGraph: {
    title: 'ImmoBenin',
    description: 'Location de propriétés au Bénin',
    url: 'https://immo-benin.com',
    siteName: 'ImmoBenin',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/logo-1200x630.png', // Image spéciale pour les réseaux
        width: 1200,
        height: 630,
        alt: 'ImmoBenin Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImmoBenin',
    description: 'Location de propriétés au Bénin',
    images: ['/logo-1200x630.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
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