import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Pinterest } from "../Icons";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white">
      {/* Email Signup Strip */}
      <div className="border-b border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-sm uppercase tracking-[0.2em] font-medium mb-2">
              Join The Community
            </h2>
            <p className="text-neutral-400 text-xs mb-6">
              Sign up for email updates and exclusive offers.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-neutral-600 text-white placeholder:text-neutral-500 text-sm focus:border-white rounded-none flex-1"
              />
              <Button className="bg-white text-black hover:bg-neutral-200 rounded-none px-6 text-xs uppercase tracking-[0.15em] font-medium">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">+91 9220726885</p>
              <p className="text-xs text-neutral-500">Mon - Sat (9 AM - 6 PM)</p>
              <p className="text-sm text-neutral-400 mt-3">support@pamara.co.in</p>
              <p className="text-xs text-neutral-500">24/7 Email Support</p>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium">About</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Help & FAQ", href: "/help-faq" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "Returns & Exchanges", href: "/cancellation-returns-exchanges" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium">Follow Us</h3>
            <div className="flex gap-4">
              {[
                { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/pamara.co.in/" },
                { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/profile.php?id=61570335279475" },
                { name: "X", icon: Twitter, href: "https://x.com/ClothingPamara" },
                { name: "Pinterest", icon: Pinterest, href: "https://www.pinterest.com/pamaraofficial/" },
              ].map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-medium">Payment Methods</h3>
            <div className="flex gap-3">
              {["/upi.jpeg", "/master.jpeg", "/netbanking.jpeg", "/visa.png"].map((payment) => (
                <div
                  key={payment}
                  className="w-10 h-7 bg-white p-1 flex items-center justify-center"
                >
                  <img src={payment} alt="payment" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} PAMARA. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-xs text-neutral-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="text-xs text-neutral-500 hover:text-white transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
