import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { ourFileRouter } from "./api/uploadthing/core";
import Providers from "@/components/Providers";
import { GeistMono } from 'geist/font/mono';

const nunitoSans = Nunito_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "PAMARA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistMono.variable}>
      <body className={GeistMono.className} style={{ color: "#1C1C1C", fontSize: "15px", backgroundColor: "#F5F5F5" }}>
        <NextTopLoader color="white" />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
