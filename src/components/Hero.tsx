"use client";

import React from "react";
// import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
// import * as reactSpring from "@react-spring/three";
// import * as drei from "@react-three/drei";
// import * as fiber from "@react-three/fiber";
import Navbar from "./Navbar";

// bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#A1C5FA_10%,#EAEEFE_80%,#eafefc_50%)]
// bg-custom-gradient gradient-bg
const Hero = ({ toggleTheme, dark }) => {
  return (
    <section className="">
      <div className="relative h-[calc(100vh-200px)] flex flex-col justify-center items-center overflow-hidden bg-[#0b1591] rounded-b-[50px] backgroundblue">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('/code.gif')",
          }}
        ></div>
        <Navbar toggleTheme={toggleTheme} dark={dark} />
        <div className="relative w-full h-full flex justify-center items-center rounded-3xl">
          <h1 className="figureshape">}</h1>
          <h1 className="figureshape">;</h1>
          <h1 className="figureshape">&lt;/&gt;</h1>

          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="quote text-5xl text-end text-white -translate-y-[50%]">
              <span className="quotafig quotafig1">"</span>
              <span className="font-cascadia text-center">
                All What You need to turn <br />
                your Idea to Solution
              </span>
              <span className="quotafig quotafig2">"</span>
            </p>

            {/* <Input type="email" placeholder="Enter your email" className="mt-5" /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
