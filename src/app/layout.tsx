import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--serif",
  display: "swap",
});
const sans = Manrope({ subsets: ["latin"], variable: "--sans", display: "swap" });

export const metadata: Metadata = {
  title: "MORSH Atelier — Interiors & bespoke furniture",
  description:
    "Interior design, bespoke furniture and 3D visualisation. See your room before it exists, then build it.",
};

export const viewport: Viewport = { themeColor: "#0b0a09" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
