"use client";

import * as motion from "motion/react-client";
import React from "react";
import Navbar from "./Navbar";
import { Icon } from "@iconify/react";
import { useScroll, useTransform } from "framer-motion";

const Hero = ({ toggleTheme, dark }) => {
  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  return (
    <motion.div
      style={{ scale: scale as any }}
      className="no-scrollbar"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.9,
        ease: "easeInOut",
      }}
    >
      {/* rounded-b-[50px] */}
      <div className="relative h-[calc(100vh-400px)] md:h-[calc(100vh-150px)] flex flex-col justify-center items-center overflow-hidden bg-[#0b1591] rounded-[40px] m-2 backgroundblue ">
        <div
          // [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/codingwallpaper.gif')",
          }}
        ></div>
        <Navbar toggleTheme={toggleTheme} dark={dark} />
        <div className="relative w-full h-full flex justify-center items-center rounded-3xl px-5 md:px-2">
          <p className="quotes font-main font-extrabold tracking-normal quote md:leading-normal text-[2rem] md:text-5xl text-white md:-translate-y-[50%]  md:max-w-screen-md text-center md:px-16 ">
            All What You need to turn your
            <span className="inline-flex h-full items-center self-center translate-y-1/4">
              <Icon icon="flat-color-icons:idea" className="mx-2" />
            </span>
            into Solutions
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
