"use client";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const testData = [
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar1.src,
    name: "Mohamad Alkhodary",
    username: "MohamadAlkhodary",
  },
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar2.src,
    name: "John Alkhodary",
    username: "MohamadAlkhodary",
  },
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar3.src,
    name: "Mohamad Alkhodary",
    username: "MohamadAlkhodary",
  },
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar4.src,
    name: "Mohamad Alkhodary",
    username: "MohamadAlkhodary",
  },
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar5.src,
    name: "Mohamad Alkhodary",
    username: "MohamadAlkhodary",
  },
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar6.src,
    name: "Mohamad Alkhodary",
    username: "MohamadAlkhodary",
  },
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar7.src,
    name: "Mohamad Alkhodary",
    username: "MohamadAlkhodary",
  },
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar8.src,
    name: "Mohamad Alkhodary",
    username: "MohamadAlkhodary",
  },
  {
    text: "As a seasoned designer always on the lookout for innovative tools,",
    imageSrc: avatar9.src,
    name: "Mohamad Alkhodary",
    username: "MohamadAlkhodary",
  },
];
const firstColumn = testData.slice(0, 3);
const secondColumn = testData.slice(3, 6);
const thirdColumn = testData.slice(6, 9);

const TestimonialCol = (props: {
  className?: string;
  testData: typeof testData;
  duration?: number;
}) => (
  <div className={props.className}>
    <motion.div
      className="flex flex-col gap-6 pb-6"
      animate={{ translateY: "-50%" }}
      transition={{
        duration: props.duration || 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
    >
      {[...new Array(2)].fill(0).map(
        (
          _,
          index //loop over them twice
        ) => (
          <React.Fragment key={index}>
            {props.testData.map(({ text, imageSrc, name, username }, index) => (
              <div className="card mx-auto" key={index}>
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <Image
                    src={imageSrc}
                    alt="name"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">
                      {name}
                    </div>
                    <div className="leading-5 tracking-tight">{username}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        )
      )}
    </motion.div>
  </div>
);
const Testimonials = () => {
  return (
    <section className="bg-white ">
      <div className="container p-10 md:p-16 mx-auto">
        <div className="section-heading">
          {/* <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div> */}
          <h2 className="section-title-one mt-5">Testimonials</h2>
          <p className="section-description">
            From intutive design to powerful features, our apps has become an
            essential tools for users around the world
          </p>
        </div>
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] mt-10 max-h-[738px] overflow-hidden">
          <TestimonialCol testData={firstColumn} duration={15} />
          <TestimonialCol
            testData={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialCol
            testData={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
