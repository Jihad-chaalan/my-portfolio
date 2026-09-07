import type { Metadata } from "next";
import { Manrope, Shrikhand, Bungee, Archivo_Black } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Manrope — body text, navigation, buttons, all long-form/readable content.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Shrikhand — personal branding/logo (name) only.
const shrikhand = Shrikhand({
  variable: "--font-shrikhand",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Bungee — project names, skill-card headings, small display headings.
const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Archivo Black — temporary free stand-in for the licensed "Bowlby One SC"
// display font used for hero title / major section headings. Swap for
// next/font/local once a licensed Bowlby One SC file is available; only
// this block and the --font-display token need to change. See docs/DESIGN.md.
const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Full-Stack AI Engineer",
    "AI Engineer",
    "RAG",
    "LLM Engineer",
    "AI Agents",
    "Next.js Developer",
    "FastAPI",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${shrikhand.variable} ${bungee.variable} ${archivoBlack.variable}`}
    >
      <body className="min-h-full bg-canvas font-sans text-forest antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-canvas focus:outline-2 focus:outline-offset-2 focus:outline-orange"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

