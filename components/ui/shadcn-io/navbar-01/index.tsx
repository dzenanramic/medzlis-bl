"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useNextPrayer } from "@/hooks/useNextPrayer";

// Simple logo component for the navbar
const Logo = (props: Omit<ImageProps, "src" | "alt" | "style">) => {
  return (
    <Image
      src="/logo.png" // Default local path
      alt="Logo"
      width={162}
      height={162}
      // style={{ height: "2em", objectFit: "contain" }}
      {...props}
    />
  );
};

// Improved hamburger icon with better animations
const HamburgerIcon = ({
  className,
  isOpen = false,
  ...props
}: React.SVGAttributes<SVGElement> & { isOpen?: boolean }) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className={cn(
        "origin-center transition-all duration-300 ease-out",
        isOpen ? "-translate-y-0 rotate-45" : "-translate-y-[7px] rotate-0"
      )}
    />
    <path
      d="M4 12H20"
      className={cn(
        "origin-center transition-all duration-300 ease-out",
        isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
      )}
    />
    <path
      d="M4 12H20"
      className={cn(
        "origin-center transition-all duration-300 ease-out",
        isOpen ? "translate-y-0 -rotate-45" : "translate-y-[7px] rotate-0"
      )}
    />
  </svg>
);

// Types
export interface Navbar01NavLink {
  href: string;
  label: string;
  active?: boolean;
}

export interface Navbar01Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar01NavLink[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

// Default navigation links
const defaultNavigationLinks: Navbar01NavLink[] = [
  { href: "/", label: "Početna" },
  { href: "/news", label: "Vijesti" },
  { href: "/membership", label: "Članarina" },
  { href: "/mosques", label: "Džamije" },
  { href: "/contact", label: "Kontakt" },
];

export const Navbar01 = React.forwardRef<HTMLElement, Navbar01Props>(
  (
    {
      className,
      logo = <Logo />,
      navigationLinks = defaultNavigationLinks,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null); // Start with null to prevent flash
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const menuRef = useRef<HTMLElement>(null);
    const pathname = usePathname();

    const isHome = pathname === "/";

    // Prevent body scroll when menu is open
    useEffect(() => {
      if (menuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      // Cleanup on unmount
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [menuOpen]);

    // Handle escape key to close menu
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && menuOpen) {
          setMenuOpen(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [menuOpen]);

    // Close menu on route change
    useEffect(() => {
      setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
      const checkWidth = () => {
        // Use window width instead of container width for more reliable detection
        const width = window.innerWidth;
        setIsMobile(width < 768); // 768px is md breakpoint
      };

      // Set initial value immediately
      checkWidth();

      // Add resize listener
      window.addEventListener("resize", checkWidth);

      return () => {
        window.removeEventListener("resize", checkWidth);
      };
    }, []);

    // Combine refs
    const combinedRef = useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Compute active links based on current pathname
    const linksWithActive = navigationLinks.map((link) => ({
      ...link,
      active:
        link.href === "/"
          ? pathname === "/"
          : pathname.startsWith(link.href) && link.href !== "/",
    }));

    // Handler to toggle menu
    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    const nextPrayer = useNextPrayer();

    return (
      <>
        <header
          ref={combinedRef}
          className={cn(
            isHome
              ? "bg-transparent border-b-0 absolute top-0 left-0 w-full"
              : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0",
            "z-40 px-4 md:px-6 [&_*]:no-underline transition-colors duration-300",
            className
          )}
          {...props}
        >
          <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
            {/* Left side: Logo only */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={cn(
                    "text-2xl font-bold transition-colors duration-300",
                    isHome ? "text-white" : "text-green-700"
                  )}
                >
                  {logo}
                </div>
              </Link>
            </div>

            {/* Right side: Navigation links, hamburger, and next prayer */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              {/* Desktop navigation */}
              {isMobile === false && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {linksWithActive.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <Link
                          href={link.href}
                          className={cn(
                            "font-medium transition-all duration-300 px-4 py-2 rounded-md relative overflow-hidden group",
                            link.active
                              ? "bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 text-white shadow-md"
                              : isHome
                              ? "text-white hover:bg-white/10"
                              : "text-foreground/80 hover:bg-green-700 hover:text-white"
                          )}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}

              {/* Mobile hamburger menu */}
              {isMobile === true && (
                <Button
                  className={cn(
                    "group h-10 w-10 rounded-full transition-all duration-300 z-50 relative",
                    menuOpen
                      ? "bg-white text-green-700 hover:bg-gray-100 shadow-lg"
                      : isHome
                      ? "text-white hover:bg-white/10"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                >
                  <HamburgerIcon
                    isOpen={menuOpen}
                    className="transition-transform duration-300"
                  />
                </Button>
              )}

              {/* Next Prayer (desktop only) */}
              {isMobile === false && nextPrayer && (
                <div
                  className={cn(
                    "ml-4 flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium shadow-sm",
                    isHome
                      ? "bg-white/20 text-white"
                      : "bg-green-50 text-green-800"
                  )}
                >
                  <span className="text-lg">{nextPrayer.icon}</span>
                  <span>{nextPrayer.name}:</span>
                  <span className="font-bold">{nextPrayer.time}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Menu Portal */}
        <AnimatePresence>
          {menuOpen && isMobile === true && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={closeMenu}
              />

              {/* Slide-in menu */}
              <motion.nav
                ref={menuRef}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col"
                style={{
                  borderTopLeftRadius: "1.5rem",
                  borderBottomLeftRadius: "1.5rem",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
                  <div className="text-xl font-semibold text-green-700 dark:text-green-400">
                    Menu
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMenu}
                    className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                    aria-label="Close menu"
                  >
                    <svg
                      width={10}
                      height={10}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform hover:scale-110"
                    >
                      <line x1="12" y1="4" x2="4" y2="12" />
                      <line x1="4" y1="4" x2="12" y2="12" />
                    </svg>
                  </Button>
                </div>

                {/* Navigation Links - Simplified structure for full width */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {linksWithActive.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="w-full"
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            "block w-full font-medium transition-all duration-300 px-4 py-4 rounded-xl text-lg relative overflow-hidden group",
                            link.active
                              ? "bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white shadow-lg"
                              : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 hover:pl-6"
                          )}
                          onClick={closeMenu}
                        >
                          <span className="relative z-10">{link.label}</span>
                          {!link.active && (
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Next Prayer (mobile only, at the bottom) */}
                {nextPrayer && (
                  <div
                    className={cn(
                      "m-4 mb-0 flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium shadow-sm",
                      "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-100"
                    )}
                  >
                    <span className="text-xl">{nextPrayer.icon}</span>
                    <span>{nextPrayer.name}:</span>
                    <span className="font-bold">{nextPrayer.time}</span>
                  </div>
                )}
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }
);

Navbar01.displayName = "Navbar01";

export { Logo, HamburgerIcon };
