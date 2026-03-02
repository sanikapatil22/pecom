"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
}

interface Section {
  items: {
    name: string;
    href: string;
    icon?: React.ReactNode; // Changed from React.ComponentType to ReactNode
    description?: string;
  }[];
}

interface NavbarDropdownContentProps {
  sections: Section[];
}

export function NavbarDropdown({ title, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 50);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "flex items-center h-full md:px-4 text-sm font-medium transition-colors",
          "hover:text-white",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50",
          isOpen ? "text-white" : "text-gray-200"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {title}
        <ChevronDown
          className={cn(
            "ml-1 h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "absolute top-full left-0 bg-zinc-900 rounded-lg shadow-lg z-50 max-w-[100px]",
          "transform transition-all duration-200 ease-out origin-top-left",
          "border border-zinc-800",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{ minWidth: "480px" }}
      >
        {children}
      </div>
    </div>
  );
}

export function NavbarDropdownContent({
  sections,
}: NavbarDropdownContentProps) {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-6 p-6">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <ul className="space-y-3">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <a
                  href={item.href}
                  className="group flex items-start gap-3 text-[15px] text-gray-200 hover:text-white transition-colors"
                >
                  {item.icon && (
                    <span className="text-gray-400 group-hover:text-purple-400 transition-colors">
                      {item.icon}
                    </span>
                  )}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
