import Providers from "@/components/Providers";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";


export const open_sans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Pinguim Chat",
  description: "Your Favorite Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gradient-to-l from-stone-200 to-slate-50">
      <body className={open_sans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
