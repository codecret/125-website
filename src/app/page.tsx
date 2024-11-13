"use client";
import { useState } from "react";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import ContactUs from "@/components/ContactUs";
import MyProject from "@/components/MyProject";
import EmblaCarousel from "@/components/embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

export default function Home() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };
  const OPTIONS: EmblaOptionsType = { loop: true };
  const imageSources = [
    "/project1.png",
    "/project2.png",
    "/project3.png",
    "/project4.png",
    "/project5.png",
    "/project6.png",
    "/project6.png",
    "/project6.png",
  ];
  return (
    <div>
      <Hero toggleTheme={toggleTheme} dark={dark} />
      <EmblaCarousel slides={imageSources} options={OPTIONS} />
      {/* <MyProject /> */}
      <Pricing />
      <Testimonials />
      <ContactUs />
    </div>
  );
}
