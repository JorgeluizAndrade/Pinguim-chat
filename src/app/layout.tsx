import Providers from "@/components/Providers";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";


export const roboto_mono = Roboto_Mono({
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
    <html lang="en" className="bg-gradient-to-r from-stone-50 to-cyan-100">
      <body className={roboto_mono.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
