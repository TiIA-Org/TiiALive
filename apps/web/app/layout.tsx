import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DanteFDD — Live",
  description: "GTA VI LIVE — 24/7. One week. Three cameras. No sleep.",
  openGraph: {
    title: "DanteFDD — Live",
    description: "GTA VI LIVE — 24/7. One week. Three cameras. No sleep.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#090b14] text-white">{children}</body>
    </html>
  );
}
