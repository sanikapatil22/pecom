import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { ourFileRouter } from "./api/uploadthing/core";
import Providers from "@/components/Providers";
import { GeistMono } from 'geist/font/mono';

const montserrat = Montserrat({ weight: "500", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PAMARA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <NextTopLoader color="white" />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
