"use client";

import * as React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { menus } from "@/lib/data";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

export default function Navbar({ toggleTheme, dark }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top bar — visible at hero, hidden on scroll */}
      <div className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-10 py-4 transition-opacity duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <Link href="/">
          <Logo color="#fff" />
        </Link>
        <div className="hidden md:flex items-center gap-4">
          {menus.map((item, id) => (
            <Link
              key={id}
              href={item.path}
              className="font-roboto text-sm text-white/80 hover:text-white transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <Link
            href="/track"
            className="font-roboto inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full bg-white/15 text-white hover:bg-white/25 border border-white/20 backdrop-blur-sm transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Track Status
          </Link>
        </div>
      </div>

      {/* Floating pill — appears on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 rounded-full px-3 py-1.5">
              <Link href="/" className="pl-2 pr-1">
                <Logo color="#3139fb" />
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {menus.map((item, id) => (
                  <Link
                    key={id}
                    href={item.path}
                    className="font-roboto text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              <Link
                href="/track"
                className="font-roboto inline-flex items-center gap-1.5 text-sm bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors ml-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Track Status
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
