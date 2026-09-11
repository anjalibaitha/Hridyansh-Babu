import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hridyansh Babu · First Birthday Invitation",
  description: "Join us in celebrating Hridyansh Babu’s first birthday on 16 September 2026 · 2083 भाद्र 31. A little invitation from Nepal, with love, laughter and blessings.",
  openGraph: {
    title: "Hridyansh Babu · First Birthday Invitation",
    description: "One year of tiny steps, big smiles and endless love. Celebrate with us on 16 September 2026 · 2083 भाद्र 31.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ne_NP",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
