import Script from "next/script";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GlobalNotification from "../components/GlobalNotification";
import JsonLd, { generateOrganizationSchema, generateWebSiteSchema } from "../components/JsonLd";
import GooglePurchaseTracker from "../components/GooglePurchaseTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.miratekstiltr.com'),
  title: "MiraTekstil | Perde Modelleri, Tül Perde & Lüks Ev Tekstili",
  description: "Eviniz için en şık perde modelleri, tül perde, blackout perde ve ışık geçirmeyen perde seçenekleri MiraTekstil'de. En son çıkan perde modelleri ve fiyatları için tıklayın.",
  authors: [{ name: 'MiraTekstil', url: 'https://www.miratekstiltr.com' }],
  publisher: 'MiraTekstil',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "MiraTekstil | Perde Modelleri, Tül Perde & Lüks Ev Tekstili",
    description: "Eviniz için en şık perde modelleri, tül perde, blackout perde ve ışık geçirmeyen perde seçenekleri MiraTekstil'de.",
    url: 'https://www.miratekstiltr.com',
    siteName: 'MiraTekstil',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: 'https://i.imgur.com/RHzDAQB.png',
        width: 1920,
        height: 1080,
        alt: 'MiraTekstil perde koleksiyonu',
      },
    ],
  },
  verification: {
    yandex: '1ab87f83fe70d252',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@miratekstil',
    creator: '@miratekstil',
    title: "MiraTekstil | Perde Modelleri, Tül Perde & Lüks Ev Tekstili",
    description:
      "Eviniz için en şık perde modelleri, tül perde, blackout perde ve ışık geçirmeyen perde seçenekleri MiraTekstil'de.",
    images: ['https://i.imgur.com/RHzDAQB.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <JsonLd data={generateOrganizationSchema()} />
        <JsonLd data={generateWebSiteSchema()} />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://i.imgur.com" />

        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <GlobalNotification />
          <GooglePurchaseTracker />
        </Providers>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YDPPEG74Z2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YDPPEG74Z2');
          `}
        </Script>
      </body>
    </html>
  );
}
