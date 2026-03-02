"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { HomePageContent } from "@prisma/client";

interface iAppProps {
  data: HomePageContent;
  bannerImages?: string[];
}

export default function Hero({ data, bannerImages }: iAppProps) {
  const images =
    bannerImages && bannerImages.length > 0
      ? bannerImages
      : [
          "https://res.cloudinary.com/deh8ebvph/video/upload/v1741616542/reintro_ztx6pc.mp4",
        ];

  const hasMultipleImages = images.length > 1;
  const isVideo = images.length === 1 && images[0].endsWith(".mp4");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 600);
      }, 300);
    },
    [isTransitioning, currentSlide]
  );

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!hasMultipleImages) return;
    const timer = setInterval(() => {
      const next = (currentSlide + 1) % images.length;
      goToSlide(next);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, images.length, hasMultipleImages, goToSlide]);

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-black">
      {/* Background */}
      {isVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={images[0]} type="video/mp4" />
        </video>
      ) : (
        images.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))
      )}

      {/* Subtle bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Centered SHOP NOW button */}
      <div className="absolute inset-0 flex items-end justify-center pb-24">
        <Link href="/collections/all-products">
          <button className="bg-white/90 backdrop-blur-sm text-black text-xs uppercase tracking-[0.25em] font-semibold px-12 py-4 hover:bg-white transition-colors">
            Shop Now
          </button>
        </Link>
      </div>

      {/* Pagination Dots - Bottom Right (YoungLA style circular) */}
      {hasMultipleImages && (
        <div className="absolute bottom-8 right-8 flex items-center gap-2.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-3 h-3 bg-transparent border-2 border-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Down arrow chevron - bottom center */}
      <button
        onClick={scrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-10 h-10 border border-white/40 rounded-full flex items-center justify-center hover:border-white transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-5 h-5 text-white" strokeWidth={1.5} />
      </button>
    </div>
  );
}
