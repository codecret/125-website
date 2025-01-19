"use client";
import { useRef, useState } from "react";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import ContactUs from "@/components/ContactUs";
import EmblaCarousel from "@/components/embla/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Footer1 from "@/components/Footer1";

export default function Home() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };
  const OPTIONS: EmblaOptionsType = { loop: true };
  const imageSources = [
    {
      videoLink: "/orseda.mp4",
      canPlay: true,
      x: 400,
      xlast: 800,
      imageLink: "/project2.png",
    },
    { videoLink: "/project3.png", canPlay: false, x: 200, xlast: 600 },
    { videoLink: "/project6.png", canPlay: false, x: 400, xlast: 400 },
    { videoLink: "/emi.png", canPlay: false, x: 400, xlast: 200 },
    { videoLink: "/project1.png", canPlay: false, x: 400, xlast: 0 },
    // { videoLink: "/project6.png", canPlay: false, x: 400, xlast: -200 },
    // { videoLink: "/project6.png", canPlay: false, x: 400, xlast: -400 },
    // { videoLink: "/project6.png", canPlay: false, x: 400, xlast: -600 },
  ];
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="overflow-hidden z-30 relative bg-white" ref={targetRef}>
        <Hero toggleTheme={toggleTheme} dark={dark} refVar={targetRef} />
        {/* <EmblaCarousel1 slides={imageSources} options={OPTIONS} /> */}
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
        {/* <Footer /> */}
      </div>
      <Footer1 />
    </div>
  );
}
