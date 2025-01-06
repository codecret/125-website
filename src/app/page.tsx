"use client";
import { useState } from "react";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import ContactUs from "@/components/ContactUs";
import EmblaCarousel from "@/components/embla/EmblaCarousel";
import Footer from "@/components/Footer";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";

export default function Home() {
  const [dark, setDark] = useState();

  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };
  const OPTIONS: EmblaOptionsType = { loop: true };
  const imageSources = [
    { videoLink: "/orseda.mp4", canPlay: true },
    { videoLink: "/project2.png", canPlay: false },
    { videoLink: "/project3.png", canPlay: false },
    { videoLink: "/project4.png", canPlay: false },
    { videoLink: "/project5.png", canPlay: false },
    { videoLink: "/project6.png", canPlay: false },
    { videoLink: "/project6.png", canPlay: false },
    { videoLink: "/project6.png", canPlay: false },
  ];
  return (
    <div className="overflow-hidden">
      <Hero toggleTheme={toggleTheme} dark={dark} />
      <EmblaCarousel slides={imageSources} options={OPTIONS} />
      {/* <div className="relative h-[150px] w-screen">
        <Image
          className=" bg-black"
          fill
          objectFit="cover"
          // objectFit="cover bg-repeat"
          src="/codingwallpaper.gif"
          alt="background image"
        />
      </div> */}
      <Pricing />
      <Testimonials />
      <ContactUs />
      <Footer />
    </div>
  );
}
