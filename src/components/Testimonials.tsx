"use client";
import avatar1 from "@/assets/people/khaled.jpeg";
import avatar2 from "@/assets/people/ahmad.png";
import avatar3 from "@/assets/people/mayyar.jpg";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-7.png";
import avatar6 from "@/assets/avatar-7.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const testData = [
  {
    text: "I highly recommend working with them for any project you have in mind.",
    imageSrc: avatar1.src,
    name: "Khaled Nadam",
    username: "Software Engineer",
  },
  {
    text: "What sets 125 apart is his ability to combine technical skills with creativity. I’m sure they will leave a lasting impression on its clients.",
    imageSrc: avatar2.src,
    name: "Ahmad Alidlibi",
    username: "Software Engineer",
  },
  {
    text: "Mohamad’s ability to turn ideas into beautifully designed and fully functional websites is unmatched.",
    imageSrc: avatar3.src,
    name: "Mayyar",
    username: "CEO @Graphic",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
    imageSrc: avatar4.src,
    name: "Name",
    username: "role",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
    imageSrc: avatar5.src,
    name: "Name",
    username: "role",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
    imageSrc: avatar6.src,
    name: "Name",
    username: "role",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing.",

    imageSrc: avatar7.src,
    name: "Name",
    username: "role",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
    imageSrc: avatar8.src,
    name: "Name",
    username: "role",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
    imageSrc: avatar9.src,
    name: "Name",
    username: "role",
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
    <section className="bg-white" id="testimonials">
      <div className="container p-10 md:p-16 mx-auto">
        <div className="section-heading">
          {/* <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div> */}
          <h2 className="section-title-one mt-5">Testimonials</h2>
          <p className="section-description">
            Our work goes beyond business. We’re proud to build lasting
            relationships with both friends and clients
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
