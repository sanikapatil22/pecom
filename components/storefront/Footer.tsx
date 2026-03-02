import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-neutral-200">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Help */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Help</h3>
            <ul className="space-y-3">
              {[
                { name: "FAQs", href: "/help-faq" },
                { name: "Returns and Exchanges", href: "/cancellation-returns-exchanges" },
                { name: "Contact Us", href: "/about" },
                { name: "Terms of Service", href: "/terms-of-use" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "Shipping Policy", href: "/shipping-policy" },
                { name: "Privacy Policy", href: "/privacy-policy" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-500 hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop With Us */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Shop With Us</h3>
            <ul className="space-y-3">
              {[
                { name: "Search", href: "/search" },
                { name: "All Products", href: "/collections/all-products" },
                { name: "T-Shirts", href: "/collections/t-shirts" },
                { name: "Hoodies", href: "/collections/hoodies" },
                { name: "Joggers", href: "/collections/joggers" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-500 hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Explore</h3>
            <ul className="space-y-3">
              {[
                { name: "Our Story", href: "/about" },
                { name: "Account", href: "/api/auth/login" },
                { name: "My Orders", href: "/my-orders" },
                { name: "Wishlist", href: "/wishlist" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-500 hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join the PAMARA Family — newsletter */}
          <div className="col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Join the PAMARA Family
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-sm">
              Instantly receive updates, access to exclusive deals, product launch details,
              and more.
            </p>
            <div className="max-w-sm">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full border border-neutral-300 px-4 py-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors mb-3"
              />
              <button className="w-full bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold py-3.5 hover:bg-neutral-800 transition-colors">
                Subscribe
              </button>
            </div>

            {/* About the Shop */}
            <div className="mt-10">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4">
                About the Shop
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                PAMARA is a lifestyle clothing brand. From start to finish, each product
                is designed with our customers and quality in mind. Our goal is to make
                unique and special products that our customers can wear with pride.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="https://www.instagram.com/pamara.co.in/"
                className="text-neutral-400 hover:text-black transition-colors"
                target="_blank"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              {/* TikTok SVG */}
              <Link
                href="https://www.facebook.com/profile.php?id=61570335279475"
                className="text-neutral-400 hover:text-black transition-colors"
                target="_blank"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-neutral-400">
              &copy; {new Date().getFullYear()} &mdash; PAMARA
            </p>

            {/* Payment methods */}
            <div className="flex items-center gap-2">
              {["/upi.jpeg", "/master.jpeg", "/netbanking.jpeg", "/visa.png"].map(
                (payment) => (
                  <div
                    key={payment}
                    className="w-10 h-7 border border-neutral-200 bg-white p-1 flex items-center justify-center"
                  >
                    <img
                      src={payment}
                      alt="payment"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
