import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

// Clash Display alternative - Space Grotesk (geometric, modern headlines)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-clash",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Satoshi alternative - Inter (clean, readable body text)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Clawsec - Security for OpenClaw",
  description:
    "Clawsec is a security plugin that prevents AI agents from taking dangerous actions. Protect your AI-powered applications with intelligent guardrails and real-time threat detection.",
  keywords: [
    "AI security",
    "OpenClaw",
    "AI guardrails",
    "agent security",
    "AI safety",
    "threat detection",
  ],
  authors: [{ name: "Clawsec Team" }],
  openGraph: {
    title: "Clawsec - Security for OpenClaw",
    description:
      "Protect your AI agents from taking dangerous actions with Clawsec security plugin.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clawsec - Security for OpenClaw",
    description:
      "Protect your AI agents from taking dangerous actions with Clawsec security plugin.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-bg-primary text-text-primary`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
