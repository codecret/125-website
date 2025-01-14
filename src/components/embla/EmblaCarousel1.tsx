import React, { useEffect, useRef } from "react";
import { inView } from "motion";
import { useInView } from "framer-motion";
import Image from "next/image";

const EmblaCarousel1 = ({ slides }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    console.log("Element is in view: ", isInView);
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="h-screen flex flex-col items-center justify-center overflow-scroll max-w-screen"
    >
      <h1 className="text-black font-main text-4xl">Projects</h1>
      <p className="text-black font-main text-xl mb-10 text-center px-[200px] mt-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis aperiam
        nesciunt amet commodi culpa voluptas illum accusamus nisi tenetur
        quaerat.
      </p>
      <div className="flex gap-7 justify-center overflow-scroll max-w-screen">
        {slides.map((ele, index) => (
          <div
            key={index}
            className="absolute min-w-[300px] h-[230px] rounded-lg"
          >
            <Image
              src={ele.videoLink}
              fill
              alt="slides"
              className="rounded-lg bg-white"
              objectFit="cover"
              style={{
                transform: isInView
                  ? `translateX(${ele.xlast}px)`
                  : `translateX(${ele.x}px)`,
                opacity: isInView ? 1 : 0,
                transition: "all 0.9s ease 0.5s",
              }}
            />
          </div>
        ))}
      </div>
      {/* dsad */}
      {/* <span
        style={{
          transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
      >
        hi
      </span> */}
    </div>
  );
};

export default EmblaCarousel1;
