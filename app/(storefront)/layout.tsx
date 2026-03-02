import { type ReactNode } from "react";
import { Navbar } from "../../components/storefront/Navbar";
import Footer from "../../components/storefront/Footer";

export default function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">{children}</main>
      <Footer />
    </>
  );
}
