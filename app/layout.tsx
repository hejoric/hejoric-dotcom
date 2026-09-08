import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hejoric.com"),
  title: {
    default: "Jose Ricardo Herrera · hejoric",
    template: "%s | hejoric",
  },
  description:
    "Jose Ricardo Herrera (Hejoric): CS student at UVA. I build niche tools, play guitar and piano, study Korean and Japanese, and track all of it in public.",
  openGraph: {
    title: "Jose Ricardo Herrera · hejoric",
    description:
      "Jose Ricardo Herrera (Hejoric): CS student at UVA. I build niche tools, play guitar and piano, study Korean and Japanese, and track all of it in public.",
    url: "https://hejoric.com",
    siteName: "hejoric",
    type: "website",
  },
  alternates: {
    canonical: "https://hejoric.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jose Ricardo Herrera",
  alternateName: "Hejoric",
  url: "https://hejoric.com",
  sameAs: [
    "https://github.com/hejoric",
    "https://youtube.com/@hejoric",
    "https://instagram.com/hejoric",
    "https://tiktok.com/@hejoric",
    "https://x.com/hejoric",
    "https://linkedin.com/in/hejoric",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} min-h-screen bg-background font-sans text-text-primary antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
