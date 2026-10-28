import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Country Lodge in Nsawam | Best 1-Star Hotel, Eastern Region",
  description:
    "A peaceful countryside retreat on Avaga Road, Nsawam. Pool, Wood Bar, on-site dining and comfortable rooms. Winner of Best 1-Star Hotel, 2024 Eastern Regional Tourism Awards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-[#faf6ec] font-[family-name:var(--font-body)] text-[#1c1917] antialiased">
        {children}
      </body>
    </html>
  );
}
