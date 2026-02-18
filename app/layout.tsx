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
        
        {/* Favicon avec votre logo SVG */}
        <link 
          rel="icon" 
          type="image/svg+xml" 
          href="data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M50%205L15%2040V70C15%2075%2020%2080%2050%2095C80%2080%2085%2075%2085%2070V40L50%205Z%22%20fill%3D%22%23FF385C%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2255%22%20r%3D%2212%22%20fill%3D%22white%22%2F%3E%3Crect%20x%3D%2244%22%20y%3D%2224%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22white%22%2F%3E%3Cline%20x1%3D%2250%22%20y1%3D%2224%22%20x2%3D%2250%22%20y2%3D%2234%22%20stroke%3D%22%23FF385C%22%20strokeWidth%3D%221.5%22%2F%3E%3Cline%20x1%3D%2244%22%20y1%3D%2229%22%20x2%3D%2256%22%20y2%3D%2229%22%20stroke%3D%22%23FF385C%22%20strokeWidth%3D%221.5%22%2F%3E%3C%2Fsvg%3E"
        />
        
        {/* Pour iOS (Apple Touch Icon) */}
        <link 
          rel="apple-touch-icon" 
          href="data:image/svg+xml,%3Csvg%20width%3D%22180%22%20height%3D%22180%22%20viewBox%3D%220%200%20100%20100%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M50%205L15%2040V70C15%2075%2020%2080%2050%2095C80%2080%2085%2075%2085%2070V40L50%205Z%22%20fill%3D%22%23FF385C%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2255%22%20r%3D%2212%22%20fill%3D%22white%22%2F%3E%3Crect%20x%3D%2244%22%20y%3D%2224%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22white%22%2F%3E%3Cline%20x1%3D%2250%22%20y1%3D%2224%22%20x2%3D%2250%22%20y2%3D%2234%22%20stroke%3D%22%23FF385C%22%20strokeWidth%3D%221.5%22%2F%3E%3Cline%20x1%3D%2244%22%20y1%3D%2229%22%20x2%3D%2256%22%20y2%3D%2229%22%20stroke%3D%22%23FF385C%22%20strokeWidth%3D%221.5%22%2F%3E%3C%2Fsvg%3E"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 font-sans selection:bg-brand selection:text-white`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}