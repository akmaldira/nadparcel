import { ThemeProvider } from "@/components/provider/theme";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NAD Parcel",
  description:
    "NAD Parcel adalah solusi sempurna untuk bingkisan Lebaran yang istimewa. Kami menawarkan berbagai paket parcel Lebaran yang penuh makna, dengan pilihan produk berkualitas yang akan memberikan kebahagiaan bagi orang tercinta. Dari makanan khas Lebaran hingga hadiah istimewa, setiap parcel dirancang dengan penuh perhatian untuk menciptakan momen spesial di hari yang fitri.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
