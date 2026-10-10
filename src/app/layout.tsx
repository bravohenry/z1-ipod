import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "z1-ipod — z1han.com 改编自 ryOS",
  description:
    "First-generation iPod player adapted from ryOS (AGPL-3.0) by Zihan Huang / z1han.com.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
