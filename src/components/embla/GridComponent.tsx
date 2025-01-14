import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
interface EventTarget {
  value: any;
}
const GridComponent = ({ elements }) => {
  return (
    <div className="relative w-full grid md:grid-cols-2 gap-4 bg-transparent p-5">
      {elements.slice(0, 4).map((element, index) => (
        <motion.div
          className="relative embla__slide__img_div shadow-sm	rounded-xl bg-gray-200 dark:shadow-white "
          key={index}
          initial={{ transform: "scale(1)" }}
          whileHover={{ transform: "scale(1.05deg)" }}
          transition={{ duration: 1 }}
        >
          {element.canPlay ? (
            <div className="project">
              <Image
                src={element.imageLink}
                alt={`Project ${index + 1}`}
                layout="fill"
                className="embla__slide__img rounded-xl object-cover"
              />
              <video
                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                loop
                muted
                preload="metadata"
                onMouseEnter={(e: React.MouseEvent<HTMLVideoElement>) => {
                  const target = e.target as HTMLVideoElement;
                  target.play();
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLVideoElement>) => {
                  const target = e.target as HTMLVideoElement;
                  target.pause();
                  target.currentTime = 0;
                }}
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
