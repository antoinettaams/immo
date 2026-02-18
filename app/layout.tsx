import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// ✅ POUR LE RESPONSIVE MOBILE
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'ImmoBenin - Louez ou proposez des espaces au Bénin',
  description: 'Maisons, appartements meublés, bureaux, salles d\'événements ou terrains. Trouvez l\'endroit idéal ou rentabilisez le vôtre.',
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
  
  // ✅ POUR L'ONGLET (avec SVG direct)
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml;base64,' + Buffer.from(`
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5L15 40V70C15 75 20 80 50 95C80 80 85 75 85 70V40L50 5Z" fill="#FF385C"/>
            <circle cx="50" cy="55" r="12" fill="white"/>
            <rect x="44" y="24" width="12" height="10" fill="white"/>
            <line x1="50" y1="24" x2="50" y2="34" stroke="#FF385C" strokeWidth="1.5"/>
            <line x1="44" y1="29" x2="56" y2="29" stroke="#FF385C" strokeWidth="1.5"/>
          </svg>
        `).toString('base64'),
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: 'data:image/svg+xml;base64,' + Buffer.from(`
          <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5L15 40V70C15 75 20 80 50 95C80 80 85 75 85 70V40L50 5Z" fill="#FF385C"/>
            <circle cx="50" cy="55" r="12" fill="white"/>
            <rect x="44" y="24" width="12" height="10" fill="white"/>
            <line x1="50" y1="24" x2="50" y2="34" stroke="#FF385C" strokeWidth="1.5"/>
            <line x1="44" y1="29" x2="56" y2="29" stroke="#FF385C" strokeWidth="1.5"/>
          </svg>
        `).toString('base64'),
        type: 'image/svg+xml',
      },
    ],
  },

  // ✅ POUR LES RÉSEAUX SOCIAUX ET GOOGLE (on peut aussi utiliser le SVG)
  openGraph: {
    title: 'ImmoBenin - Location au Bénin',
    description: 'Trouvez votre prochain logement ou espace au Bénin',
    url: 'https://immo-benin.com',
    siteName: 'ImmoBenin',
    images: [
      {
        url: 'data:image/svg+xml;base64,' + Buffer.from(`
          <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1200" height="630" fill="white"/>
            <circle cx="600" cy="200" r="100" fill="#FF385C"/>
            <path d="M600 100L500 200L600 300L700 200L600 100Z" fill="white"/>
            <text x="300" y="450" font-family="Arial" font-size="48" fill="#FF385C">ImmoBenin</text>
            <text x="300" y="520" font-family="Arial" font-size="24" fill="#666">Louez ou proposez des espaces</text>
          </svg>
        `).toString('base64'),
        width: 1200,
        height: 630,
        alt: 'ImmoBenin',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },

  // ✅ POUR TWITTER
  twitter: {
    card: 'summary_large_image',
    title: 'ImmoBenin',
    description: 'Louez ou proposez des espaces au Bénin',
    images: ['data:image/svg+xml;base64,' + Buffer.from(`
      <svg width="1200" height="600" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="600" fill="#FF385C"/>
        <text x="150" y="300" font-family="Arial" font-size="72" fill="white" font-weight="bold">ImmoBenin</text>
        <text x="150" y="400" font-family="Arial" font-size="36" fill="white">📍 Bénin</text>
      </svg>
    `).toString('base64')],
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
        {children}
        <Footer />
      </body>
    </html>
  );
}