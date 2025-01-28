"use client";
import { useRef, useState } from "react";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import ContactUs from "@/components/ContactUs";
import EmblaCarousel from "@/components/embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Footer1 from "@/components/Footer1";
import { projects } from "@/lib/data";

export default function Home() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };
  const OPTIONS: EmblaOptionsType = { loop: true };

  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="overflow-hidden z-30 relative bg-white" ref={targetRef}>
        <Hero toggleTheme={toggleTheme} dark={dark} refVar={targetRef} />
        {/* <EmblaCarousel1 slides={imageSources} options={OPTIONS} /> */}
        <EmblaCarousel slides={projects} options={OPTIONS} />
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
        {/* <Footer /> */}
      </div>
      <Footer1 />
    </div>
  );
}
