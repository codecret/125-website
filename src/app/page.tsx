"use client";
import Navbar from "@/components/Navbar";
import { Roboto } from "next/font/google";
import { useState } from "react";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import ContactUs from "@/components/ContactUs";
import MyProject from "@/components/MyProject";

export default function Home() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  return (
    <div>
      <Hero toggleTheme={toggleTheme} dark={dark} />
      <MyProject />
      <Pricing />
      <Testimonials />
      <ContactUs />
    </div>
  );
}
