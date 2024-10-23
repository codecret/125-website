"use client";
import Navbar from "@/components/Navbar";
import { Roboto } from "next/font/google";
import { useState } from "react";
import Hero from "../components/Hero";

const roboto = Roboto({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const [dark, setDark] = useState(false);
  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };
  return (
    <div className={roboto.className}>
      <Navbar toggleTheme={toggleTheme} dark={dark} />
      <Hero />
    </div>
  );
}
