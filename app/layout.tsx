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
  title: "MiraTekstil | Lüks Ev Tekstili, Nevresim Takımları & Dekorasyon",
  description: "MiraTekstil ile evinize zarafet katın. En kaliteli pamuk nevresim takımları, bambu havlular, ipek yastık kılıfları ve modern ev dekorasyon ürünleri.",
  keywords: "mira tekstil, ev tekstili, nevresim takımı, bambu havlu, ipek yastık kılıfı, dekoratif yastık, koltuk şalı, lüks ev dekorasyonu, çeyiz seti",
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
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <GlobalNotification />
        </Providers>
      </body>
    </html>
  );
}
