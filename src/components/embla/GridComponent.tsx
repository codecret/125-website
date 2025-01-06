import Image from "next/image";
import React from "react";
import { motion } from "motion/react";

const GridComponent = ({ elements }) => {
  return (
    <div className="relative w-full grid md:grid-cols-2 gap-4 bg-transparent p-5">
      {elements.slice(0, 4).map((element, index) => (
        <motion.div
          className="relative embla__slide__img_div shadow-sm	rounded-xl bg-gray-200 dark:shadow-white "
          key={index}
          // initial={{ transform: "rotate(0)" }}
          // whileHover={{ transform: "rotate(5deg)" }}
          // transition={{ duration: 1 }}
        >
          {element.canPlay ? (
            <div className="project">
              <video
                className="preview-video"
                loop
                muted
                autoPlay
                preload="metadata"
              >
                <source src="/orseda.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <Image
              fill
              objectFit="cover"
              objectPosition="top"
              src={element.videoLink}
              className="embla__slide__img rounded-xl"
              alt={`Project ${index + 1}`}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default GridComponent;
