"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion"; // Add this if you use framer-motion (optional, for smooth animation)

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

// Hamburger icon component
const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
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
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
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
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // NEW: state for mobile menu
    const containerRef = useRef<HTMLElement>(null);
    const pathname = usePathname();

    const isHome = pathname === "/";

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback(
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

    // Handler to close menu on link click or overlay click
    const closeMenu = () => setMenuOpen(false);

    return (
      <header
        ref={combinedRef}
        className={cn(
          isHome
            ? "bg-transparent border-b-0 absolute top-0 left-0 w-full"
            : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0",
          "z-50 px-4 md:px-6 [&_*]:no-underline",
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
                  "text-2xl font-bold",
                  isHome ? "text-white" : "text-green-700"
                )}
              >
                {logo}
              </div>
            </Link>
          </div>
          {/* Right side: Navigation links and hamburger */}
          <div className="flex items-center gap-3">
            {/* Desktop navigation */}
            {!isMobile && (
              <NavigationMenu className="flex">
                <NavigationMenuList className="gap-1">
                  {linksWithActive.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <Link
                        href={link.href}
                        className={cn(
                          "font-medium hover:bg-green-700 hover:text-white transition-colors px-4 py-2 rounded-md",
                          link.active
                            ? "bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 text-white"
                            : isHome
                            ? "text-white"
                            : "text-foreground/80"
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
            {isMobile && (
              <>
                <Button
                  className={cn(
                    "group h-9 w-9 hover:bg-accent hover:text-accent-foreground",
                    isHome && "text-white"
                  )}
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <HamburgerIcon className={isHome ? "text-white" : ""} />
                </Button>
                {/* Overlay */}
                <AnimatePresence>
                  {menuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black"
                        onClick={closeMenu}
                      />
                      {/* Slide-in menu */}
                      <motion.nav
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-72 max-w-full bg-white dark:bg-zinc-900 shadow-lg z-50 flex flex-col p-6"
                        style={{
                          borderTopLeftRadius: "1rem",
                          borderBottomLeftRadius: "1rem",
                        }}
                      >
                        <div className="flex justify-end mb-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeMenu}
                            aria-label="Close menu"
                          >
                            <svg
                              width={24}
                              height={24}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </Button>
                        </div>
                        <NavigationMenu className="w-full">
                          <NavigationMenuList className="flex-col items-start gap-2 w-full">
                            {linksWithActive.map((link, index) => (
                              <NavigationMenuItem
                                key={index}
                                className="w-full"
                              >
                                <Link
                                  href={link.href}
                                  className={cn(
                                    "block font-medium transition-colors px-4 py-3 rounded-lg w-full text-lg",
                                    link.active
                                      ? "bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 text-white"
                                      : isHome
                                      ? "text-green-900 dark:text-white"
                                      : "text-foreground/80 hover:bg-green-700 hover:text-white"
                                  )}
                                  onClick={closeMenu}
                                >
                                  {link.label}
                                </Link>
                              </NavigationMenuItem>
                            ))}
                          </NavigationMenuList>
                        </NavigationMenu>
                      </motion.nav>
                    </>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }
);

Navbar01.displayName = "Navbar01";

export { Logo, HamburgerIcon };
