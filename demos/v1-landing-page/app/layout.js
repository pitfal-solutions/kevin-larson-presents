import { Libre_Baskerville, Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "./site-config";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const description =
  "Kevin Larson Presents produces Denver's signature themed hotel-takeover events — White Rose Gala, Denver Mardi Gras, Denver Derby Day, Paranormal Palace, and Jammy Jam.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kevin Larson Presents | Denver's Signature Themed Events",
    template: "%s | Kevin Larson Presents",
  },
  description,
  openGraph: {
    title: "Kevin Larson Presents | Denver's Signature Themed Events",
    description,
    url: SITE_URL,
    siteName: "Kevin Larson Presents",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Larson Presents | Denver's Signature Themed Events",
    description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
