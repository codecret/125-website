import React from "react";
import { data } from "../lib/data";
import Image from "next/image";

const Logo = () => {
  const logoSrc = data.personal.logo;
  return <Image src={logoSrc} alt="logo" width={50} height={80} />;
};

export default Logo;
