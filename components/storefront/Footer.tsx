import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Pinterest } from "../Icons";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Stay in the loop Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Join the PAMARA community now</h2>
            <p className="text-sm text-gray-600">Sign up for email updates today.</p>
            <div className="space-y-3">
              <div className="flex max-w-[300px]">
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="rounded-r-none border-r-0 focus:ring-2 focus:ring-black"
                />
                <Button
                  variant="default"
                  className="rounded-l-none bg-black hover:bg-gray-800 transition-colors duration-300"
                >
                  Sign Up
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                By providing your email, you agree to the{" "}
                <Link href="/terms-of-use" className="underline hover:text-gray-800 transition-colors duration-300">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline hover:text-gray-800 transition-colors duration-300">
                  Privacy Policy
                </Link>
                . You may later unsubscribe.
              </p>
            </div>
            <div className="pt-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Accepted Payment Methods</h3>
              <div className="flex gap-3">
                {["/upi.jpeg", "/master.jpeg", "/netbanking.jpeg", "/visa.png"].map((payment) => (
                  <div
                    key={payment}
                    className="w-12 h-8 bg-white rounded-md shadow-sm p-1 flex items-center justify-center"
                  >
                    <img src={payment || "/placeholder.svg"} alt="payment" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phone Support Section */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800">Phone Support</h2>
              <p className="text-lg font-semibold text-gray-700">+91 9220726885</p>
              <p className="text-sm text-gray-600">
                Monday - Saturday (9 AM - 6 PM)
              </p>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-800">Contact Us</h2>
              <p className="text-lg font-semibold text-gray-700">support@pamara.co.in</p>
              <p className="text-sm text-gray-600">
                24/7 Support for all your queries on email
              </p>
            </div>
          </div>

          {/* Customer Service Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">About Pamara</h2>
            <ul className="space-y-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Help & FAQ", href: "/help-faq" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "Cancelation, Returns & Exchanges Policy", href: "/cancellation-returns-exchanges" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">PAMARA Social</h2>
            <div className="flex gap-4">
              {[
                { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/pamara.co.in/" },
                { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/profile.php?id=61570335279475" },
                { name: "X (Twitter)", icon: Twitter, href: "https://x.com/ClothingPamara" },
                { name: "Pinterest", icon: Pinterest, href: "https://www.pinterest.com/pamaraofficial/" }
              ].map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-600 hover:text-black transition-colors duration-300"
                >
                  <social.icon className="w-6 h-6" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} PAMARA®. Inc.{" "}
            <Link href="/privacy-policy" className="underline hover:text-black transition-colors duration-300">
              Privacy Policy
            </Link>{" "}
            /{" "}
            <Link href="/terms-of-use" className="underline hover:text-black transition-colors duration-300">
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
