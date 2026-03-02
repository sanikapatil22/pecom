import { type ReactNode } from "react";
import { Navbar } from "../../components/storefront/Navbar";
import Footer from "../../components/storefront/Footer";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";

export default function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <MaxWidthWrapper>
        <main className="">{children}</main>
      </MaxWidthWrapper>
      <Footer />
    </>
  );
}
