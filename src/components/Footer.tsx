import React from "react";
import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <div
      className="w-full bg-black px-20 py-10 mx-auto bg-cover"
      style={{
        backgroundImage: "url('/backgroundblue.png')",
      }}
    >
      <div className="social-media-links mx-auto flex justify-center gap-5">
        <Icon icon="mdi:instagram" color="white" fontSize={30} />
        <Icon
          icon="hugeicons:new-twitter-rectangle"
          color="white"
          fontSize={30}
        />
        <Icon icon="ic:baseline-whatsapp" color="white" fontSize={30} />
      </div>
      <p className="text-white/70 text-center mt-3 font-light">
        © 2024 125, Inc. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
