"use client";

import React from "react";
import { Input } from "@/components/ui/input";

import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";

const Hero = () => {
  return (
    // bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#A1C5FA_10%,#EAEEFE_80%,#eafefc_50%)]
    // bg-custom-gradient gradient-bg
    <div className="dark:bg-black-800 h-[calc(100vh-400px)] flex justify-center items-center overflow-hidden">
      <div className="relative w-full h-full flex justify-center items-center">
        <ShaderGradientCanvas
          importedFiber={{ ...fiber, ...drei, ...reactSpring }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            pointerEvents: "none",
            zIndex: -1,
          }}
          pixelDensity={1}
          fov={40}
        >
          <ShaderGradient
            type="plane"
            color1="#0077FF"
            color2="#7db8e3"
            color3="#d4e0f4"
            frameRate={10}
            cameraZoom={1}
            brightness={1 * Math.PI}
            // lightType="3d"
            envPreset="city"
            cDistance={3.9}
            animate="on"
            uAmplitude={0}
            uFrequency={5.5}
            uStrength={3.4}
            uSpeed={0.1}
            uTime={0.1}
            range="enabled"
            cAzimuthAngle={180}
            enableTransition={false}
          />
          {/* cPolarAngle={115}
        range="disabled"
        uAmplitude={0}
        uDensity={1.1}
        uFrequency={5.5}
        uStrength={2.4}
        uSpeed={0.1}
        uTime={0.2}
        grain="off"
        reflection={0.1}
        positionX={-1}
        positionZ={-1}
        rotationZ={235}
        enableTransition={false} */}
        </ShaderGradientCanvas>
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-4xl text-white">
            All What You need to turn your <br /> Idea to Solution
          </p>
          {/* <Input type="email" placeholder="Enter your email" className="mt-5" /> */}
        </div>
      </div>
      {/* start square */}
    </div>
  );
};

export default Hero;
