import React from "react";

interface Logo {
  className?: string;
  onClick?: () => void;
}

const FooterLogo = ({ className, onClick }: Logo) => {
  return <p className="font-shrinkHand text-white text-7xl">125</p>;
};

export default FooterLogo;
