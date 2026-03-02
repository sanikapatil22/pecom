"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banner } from "@prisma/client";

const carouselItems = [
  {
    image: "/Regular-Polo.jpg",
    title: "Premium Clothing Destination",
    cta: "SHOP NOW",
    subtitle: "",
    bottomBanner: "Get 1 hoodie at as low as 799",
  },
  /* {
    image: "/shoes/vapor/pic-2.png",
    title: "New Collection",
    cta: "EXPLORE",
    subtitle: "",
    bottomBanner: "Up to 50% off on selected items",
  }, */
];

interface Props {
  bannerData? : Banner | null;
}

export function HeroCarousel({bannerData} : Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
    }),
    center: {
      zIndex: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
    }),
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
  };

  return (
    <div className="relative w-full max-w-[1550px] mx-auto mb-8 md:mb-12">
      <Card className="overflow-hidden rounded-lg">
        <div className="relative h-[350px] sm:h-[400px] md:h-[550px] w-full">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", bounce: 0 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${bannerData?.imageString})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
                <div className="flex flex-col justify-end h-full max-w-5xl md:px-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white/70 mb-2 md:mb-4 leading-tight">
                    {bannerData?.title}
                  </h2>
                </div>
              </div>
              {/* <div className="absolute bottom-0 w-full bg-yellow-400 py-2 md:py-3 px-3 md:px-4 text-center text-black text-sm sm:text-base md:text-lg font-medium">
                {carouselItems[currentSlide].bottomBanner}
              </div> */}
            </motion.div>
          </AnimatePresence>

          {/* <Button
            variant="outline"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/75 backdrop-blur-sm hover:bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 active:scale-95 transition-transform duration-200 z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/75 backdrop-blur-sm hover:bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 active:scale-95 transition-transform duration-200 z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </Button> */}
        </div>
      </Card>

      <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${index === currentSlide ? "bg-white w-3 sm:w-4" : "bg-white/50"
              }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
