import type { Metadata } from "next";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
});



export const metadata: Metadata = {
  title: "Summarizer - AI-Powered PDF Summarizer",
  description: "Save hours of reading time. Transform lengthy PDFs into clear, accurate summarises in seconds with our advanced AI technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${fontSans.variable} font-sans antialiased`}
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  );
}
