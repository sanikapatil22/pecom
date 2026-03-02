"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HomePageContent } from "@prisma/client";

interface iAppProps {
  data: HomePageContent
}

export default function Hero({ data }: iAppProps) {
  return (
    <div className="relative max-w-[1550px] mx-auto">
      {/* Main Hero Section */}
      <Card className="overflow-hidden rounded-none  bg-black">
        <div className="relative h-[100vh] sm:h-[600px] md:h-[600px] lg:h-[600px] xl:h-[600px] w-full">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          >
            <source
              src="https://res.cloudinary.com/deh8ebvph/video/upload/v1741616542/reintro_ztx6pc.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="max-w-[650px] relative">
              {/* Main Heading with Enhanced Animation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-[3.5rem] md:text-left text-center xs:text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-bold leading-none tracking-tight text-white opacity-20">
                  {data.headingLarge}
                </h1>
                <h2
                  className="md:text-left text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white 
                             -mt-2 xs:-mt-3 sm:-mt-4 md:-mt-6 lg:-mt-8 mb-4 sm:mb-6"
                >
                  {data.headingSmall}
                </h2>
              </motion.div>

              {/* Secondary Content with Staggered Animation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Tagline */}
                <h3 className="md:text-left text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  {data.tagline}
                </h3>

                {/* Description */}
                <p className="md:text-left text-center text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl">
                  {data.description}
                </p>

                {/* CTA Buttons with Enhanced Mobile Layout */}
              </motion.div>
            </div>
          </div>

          {/* Enhanced Floating Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="absolute bottom-4 right-4 xs:bottom-6 xs:right-6 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-12 
                       max-w-[180px] xs:max-w-[220px] sm:max-w-[250px] lg:max-w-sm"
          >
            <Card className="bg-white/10 backdrop-blur-md p-4 sm:p-6 border-0">
              <p className="text-white/90 text-xs sm:text-sm font-medium">
                New Collection
              </p>
              <h4 className="text-white text-base xs:text-lg sm:text-xl lg:text-2xl font-bold mt-1 sm:mt-2 mb-2 sm:mb-4">
                {data.cardTitle}
              </h4>
              <Link href="/collections/new-collection">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm 
                         transition-all duration-300 hover:scale-[1.02]"
                >
                  Explore Now
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden sm:flex flex-col items-center"
          >
            <span className="text-white/70 text-xs tracking-widest mb-2">
              SCROLL
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-4 h-4 text-white/70" />
            </motion.div>
          </motion.div>
        </div>
      </Card>

      {/* Bottom Section with Enhanced Animation */}
    </div>
  );
}
