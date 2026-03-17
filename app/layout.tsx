import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://hejoric.com"),
  title: {
    default: "Jose R. Herrera · hejoric",
    template: "%s | hejoric",
  },
  description:
    "Personal site and portfolio of Jose R. Herrera (hejoric) — CS student, full-stack developer, and builder.",
  openGraph: {
    title: "Jose R. Herrera · hejoric",
    description:
      "Personal site and portfolio of Jose R. Herrera (hejoric) — CS student, full-stack developer, and builder.",
    url: "https://hejoric.com",
    siteName: "hejoric",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://hejoric.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jose R. Herrera",
  alternateName: "hejoric",
  url: "https://hejoric.com",
  sameAs: [
    "https://github.com/hejoric",
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
        className={`${inter.variable} min-h-screen bg-background font-sans text-text-primary antialiased`}
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
