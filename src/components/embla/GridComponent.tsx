import Image from "next/image";
import React from "react";

const GridComponent = ({ elements }) => {
  return (
    <div className="relativew-full grid grid-cols-2 gap-4">
      {elements.slice(0, 4).map((image, index) => (
        <div
          className="relative embla__slide__img_div shadow-sm	rounded-xl bg-gray-200 dark:shadow-white "
          key={index}
        >
          <Image
            fill
            objectFit="cover"
            objectPosition="top"
            src={image}
            className="embla__slide__img rounded-xl"
            alt={`Project ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
};

export default GridComponent;
