import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

// --- EDIT THIS SECTION ---
export const metadata: Metadata = {
  title: "MovieTinder | Stop Scrolling, Start Watching",
  description: "AI-powered movie recommendations based on your mood and taste.",
  icons: {
    icon: '/favicon.ico', // You can replace this file later
  },
};
// -------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}