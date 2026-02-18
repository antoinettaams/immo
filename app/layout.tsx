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
  openGraph: {
    title: 'ImmoBenin',
    description: 'Location de propriétés au Bénin',
    url: 'https://immo-benin.com',
    siteName: 'ImmoBenin',
    locale: 'fr_FR',
    type: 'website',
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
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 font-sans selection:bg-brand selection:text-white`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}