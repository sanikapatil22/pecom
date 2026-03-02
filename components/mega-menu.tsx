"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface MegaMenuItem {
  title: string
  href: string
  description?: string
}

interface MegaMenuSection {
  title: string
  items: MegaMenuItem[]
}

interface MegaMenuProps {
  isOpen: boolean
  sections: MegaMenuSection[]
  onClose: () => void
}

export function MegaMenu({ isOpen, sections, onClose }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50"
            onMouseLeave={onClose}
          >
            <div className="max-w-[1550px] mx-auto px-4 py-6">
              <div className="grid grid-cols-4 gap-8">
                {sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-4">
                      {section.items.map((item) => (
                        <li key={item.title}>
                          <Link
                            href={item.href}
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                          >
                            {item.title}
                          </Link>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  )
}


