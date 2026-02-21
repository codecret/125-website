import Image from "next/image";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

const MyProject = () => {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()]);

  const imageSources = [
    "/project1.png",
    "/project2.png",
    "/project3.png",
    "/project4.png",
    "/project5.png",
    "/project6.png",
    "/project6.png",
    "/project6.png",
  ];
  return (
    <div
      className="embla grid grid-cols-2 grid-rows-2 gap-2 sm:gap-4 w-full p-4 sm:p-10 md:p-16 mx-auto items-center"
      ref={emblaRef}
    >
      {imageSources.slice(0, 4).map((ele, index) => (
        <div className="relative embla__slide rounded-3xl" key={index}>
          <Image
            src={ele}
            fill
            alt={`project ${index}`}
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
      ))}
    </div>
  );
};

export default MyProject;
