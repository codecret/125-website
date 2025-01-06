"use client";

import * as motion from "motion/react-client";
import React from "react";
import Navbar from "./Navbar";
import { Icon } from "@iconify/react";

// bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#A1C5FA_10%,#EAEEFE_80%,#eafefc_50%)]
// bg-custom-gradient gradient-bg
const Hero = ({ toggleTheme, dark }) => {
  return (
    <motion.div
      className="no-scrollbar"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.9,
        ease: "easeInOut",

        // scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}

      // style={ball}
    >
      {/* rounded-b-[50px] */}
      <div className="relative h-[calc(100vh-400px)] md:h-[calc(100vh-200px)] flex flex-col justify-center items-center overflow-hidden bg-[#0b1591] rounded-[40px] m-2 backgroundblue ">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] "
          style={{
            backgroundImage: "url('/codingwallpaper.gif')",
          }}
        ></div>
        <Navbar toggleTheme={toggleTheme} dark={dark} />
        <div className="relative w-full h-full flex justify-center items-center rounded-3xl px-5 md:px-0">
          {/* <h1 className="figureshape">}</h1>
          <h1 className="figureshape">;</h1>
          <h1 className="figureshape">&lt;/&gt;</h1> */}

          {/* <div className="relative z-10 flex flex-col items-center text-center"> */}
          <motion.p
            className="font-main font-extrabold tracking-widest quote md:leading-normal text-4xl md:text-5xl text-white md:-translate-y-[50%] space-y-2 max-w-screen-md text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            transition={{
              type: "keyframes",
              bounce: 0.25,
              delay: 1,
              ease: "easeInOut",
            }}
          >
            {/* Part 1: Text with Font */}
            All What You need to turn your idea to Solution
            {/* <span className="inline-flex"> */}
            {/* <span className="quotafig quotafig1 font-main h-[20px] scale-x-[-1] scale-y-[-1] opacity-45">
                  "
                </span>
              </span>
              <span className="inline-flex">
                <Icon icon="flat-color-icons:idea" className="mx-2" />
                <span>to Solution</span>
                <span className="quotafig quotafig2 font-main opacity-45">
                  "
                </span>
              </span> */}
          </motion.p>
          {/* </div> */}
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
