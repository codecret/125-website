"use client";

import * as React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { menus } from "@/lib/data";

export default function Navbar({ toggleTheme, dark }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 ${
        scrolled ? "py-3 px-4" : "py-0 px-0"
      }`}
    >
      <div
        className={`flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "max-w-3xl w-full bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 rounded-full px-3 py-1.5"
            : "w-full bg-transparent px-6 sm:px-10 py-4"
        }`}
      >
        <Link href="/">
          <Logo color={scrolled ? "#3139fb" : "#fff"} />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {menus.map((item, id) => (
            <Link
              key={id}
              href={item.path}
              className={`font-roboto text-sm px-3 py-1.5 rounded-full transition-colors ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <Link
          href="/track"
          className={`font-roboto inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full transition-all duration-300 ${
            scrolled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-white/15 text-white hover:bg-white/25 border border-white/20 backdrop-blur-sm"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          Track Status
        </Link>
      </div>
    </nav>
  );
}
