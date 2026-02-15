import Script from "next/script";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GlobalNotification from "../components/GlobalNotification";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://miratekstil.com"),
  alternates: {
    canonical: "/",
  },
  title: "MiraTekstil | Perde Modelleri, Tül Perde & Lüks Ev Tekstili",
  description:
    "Eviniz için en şık perde modelleri, tül perde, blackout perde ve ışık geçirmeyen perde seçenekleri MiraTekstil'de. En son çıkan perde modelleri ve fiyatları için tıklayın.",
  authors: [{ name: "MiraTekstil", url: "https://miratekstil.com" }],
  publisher: "MiraTekstil",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "MiraTekstil | Perde Modelleri, Tül Perde & Lüks Ev Tekstili",
    description:
      "Eviniz için en şık perde modelleri, tül perde, blackout perde ve ışık geçirmeyen perde seçenekleri MiraTekstil'de.",
    url: "https://miratekstil.com",
    siteName: "MiraTekstil",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@miratekstil",
    creator: "@miratekstil",
    title: "MiraTekstil | Perde Modelleri, Tül Perde & Lüks Ev Tekstili",
    description:
      "Eviniz için en şık perde modelleri, tül perde, blackout perde ve ışık geçirmeyen perde seçenekleri MiraTekstil'de.",
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
        <link rel="preconnect" href="https://tekstil-6f7d4.firebaseapp.com" />
        <link rel="dns-prefetch" href="https://tekstil-6f7d4.firebaseapp.com" />
        {/* GLOBAL RATING SCHEMA (yorum snippet için) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "MiraTekstil",
              url: "https://miratekstil.com",
              description:
                "Perde modelleri, tül perde, blackout perde ve ev tekstili ürünleri sunan MiraTekstil.",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "120",
              },
            }),
          }}
        />

        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <GlobalNotification />
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
