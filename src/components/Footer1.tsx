import Link from "next/link";
import React from "react";
import FooterLogo from "./FooterLogo";
import JumpingMan from "./JumpingMan";
import { Icon } from "@iconify/react";
import { data } from "@/lib/data";
interface FooterContent {
  text: string;
  href: string;
  target: string;
}
const Footer1 = ({ style }: { style?: object }) => {
  const socialMedia = data.socialMedia;
  return (
    <footer
      className="sticky bottom-0 flex  w-full flex-col items-end 
    bg-[#16161D]"
      style={{
        ...style,
        backgroundImage: "url('/backgroundblue.png')",
      }}
    >
      <div className="social-media-links mx-auto flex justify-center gap-5 my-10">
        <Link href={`https://www.instagram.com/${socialMedia.instagram}`}>
          <Icon icon="mdi:instagram" color="white" fontSize={30} />
        </Link>
        <Link href={`https://x.com/${socialMedia.x}`}>
          <Icon
            icon="hugeicons:new-twitter-rectangle"
            color="white"
            fontSize={30}
          />
        </Link>
        <Link href={`https://wa.me/${socialMedia.whatsapp}`}>
          <Icon icon="ic:baseline-whatsapp" color="white" fontSize={30} />
        </Link>
      </div>
      <section
        className="container mt-auto mx-auto flex flex-col items-center justify-between 
     gap-6 sm:gap-12 px-4 sm:px-6 text-[#EEEAEA] md:px-0 lg:flex-row lg:gap-0 lg:px-10 xl:justify-around xl:px-0"
      >
        <JumpingMan className="h-auto w-[80vw] max-w-[275px] sm:max-w-none sm:w-[315px]" />
        {/* large screens */}
        <h2
          className={`font-main footer-heading-large hidden lg:block max-w-[500px] w-full`}
        >
          Your business, <br /> our passion, <br /> and a product that speaks
          volumes.
        </h2>
        {/* small screen */}
        <h2 className={`font-main footer-heading block lg:hidden mb-5`}>
          Your business, <br /> our passion, <br /> and a product that speaks
          volumes.
          <span className="group ml-4 inline-flex -translate-y-1 pt-0 md:ml-0 md:block md:translate-y-0 md:pb-0"></span>
        </h2>
      </section>

      <section
        className="flex w-full flex-row overflow-x-hidden border-t-[1px] border-[#EEEAEA]
       py-6 lg:border-t-0 lg:py-[30px]"
      >
        <div className="marquee-section flex min-w-full justify-around">
          <FooterLogo
            className="h-[42px] w-auto fill-[#EEEAEA] sm:h-[47px] 
          md:h-[50px] lg:h-[113px] xl:h-[130px] 2xl:h-[108px]"
          />
          <FooterLogo
            className="h-[42px] w-auto fill-[#EEEAEA] sm:h-[47px] 
          md:h-[50px] lg:h-[113px] xl:h-[130px] 2xl:h-[108px]"
          />
          <FooterLogo
            className="hidden h-[42px] w-auto fill-[#EEEAEA] sm:block 
          sm:h-[47px] md:h-[50px] lg:hidden 2xl:block 2xl:h-[108px]"
          />
        </div>
        <div className="marquee-section flex min-w-full justify-around">
          <FooterLogo
            className="h-[42px] w-auto fill-[#EEEAEA] sm:h-[47px] 
          md:h-[50px] lg:h-[113px] xl:h-[130px] 2xl:h-[108px]"
          />
          <FooterLogo
            className="h-[42px] w-auto fill-[#EEEAEA] sm:h-[47px] 
          md:h-[50px] lg:h-[113px] xl:h-[130px] 2xl:h-[108px]"
          />
          <FooterLogo
            className="hidden h-[42px] w-auto fill-[#EEEAEA] 
          sm:block sm:h-[47px] md:h-[50px] lg:hidden 2xl:block 2xl:h-[108px]"
          />
        </div>
      </section>
    </footer>
  );
};

export default Footer1;
