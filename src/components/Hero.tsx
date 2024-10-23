"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import SwiperComponent from "./SwiperComponent";

// bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#A1C5FA_10%,#EAEEFE_80%,#eafefc_50%)]
// bg-custom-gradient gradient-bg
const Hero = () => {
  return (
    <section className="">
      <div className="dark:bg-black-800 h-[calc(100vh-400px)] flex justify-center items-center overflow-hidden">
        <div className="relative w-full h-full flex justify-center items-center rounded-3xl">
          <ShaderGradientCanvas
            importedFiber={{ ...fiber, ...drei, ...reactSpring }}
            style={{
              position: "absolute",
              top: 0,
              width: "100vw",
              height: "100vh",
              pointerEvents: "none",
            }}
            pixelDensity={1}
            fov={40}
          >
            <ShaderGradient
              type="plane"
              color1="#3045ff"
              color2="#cfd7e3"
              color3="#eaeff4"
              cameraZoom={9.1}
              brightness={0.6}
              lightType="3d"
              cDistance={2.4}
              cAzimuthAngle={180}
              cPolarAngle={80}
              uAmplitude={0}
              animate="on"
              grain="on"
              uDensity={1.5}
              uFrequency={5.5}
              uStrength={1.6}
              uSpeed={0.3}
              uTime={0.1}
              reflection={0.1}
              positionX={0}
              positionY={0}
              positionZ={0}
              // rotationZ={180}
              enableTransition={false}
              // envPreset=city&&gizmoHelper=hide&grain=on&&pixelDensity=1&&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-6&uDensity=1.5&uFrequency=0&uSpeed=0.3&
            />
          </ShaderGradientCanvas>

          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-4xl text-white">
              All What You need to turn your <br /> Idea to Solution
            </p>
            {/* <Input type="email" placeholder="Enter your email" className="mt-5" /> */}
          </div>
        </div>
      </div>
      <SwiperComponent />
    </section>
  );
};

export default Hero;
