'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { Percent, ArrowRight } from 'lucide-react'

export const PromotionalBanner = () => {
  return (
    <motion.div
      className="relative overflow-hidden bg-black h-[200px] mb-6 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-75" />
        {/* Prominent Sharp Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
                opacity: 0.1 + Math.random() * 0.2,
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              animate={{
                y: [0, 30, 0],
                rotate: [0, 180, 0],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
      <div className="relative h-full flex flex-col justify-center px-8 z-10">
        <div className="flex items-center space-x-2 text-white mb-2">
          <Percent className="h-6 w-6" />
          <span className="text-lg font-semibold">Limited Time Offer</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Get up to 50% off
        </h2>
        <Link
          href="/sale"
          className="inline-flex items-center text-white hover:text-gray-200 font-medium group transition-colors duration-200"
        >
          Shop Sale
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      {/* Sharp Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent pointer-events-none" />
    </motion.div>
  )
}


