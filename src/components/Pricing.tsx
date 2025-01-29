"use client";

import { twMerge } from "tailwind-merge";
import { CheckIcon } from "lucide-react";
import { useInView, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { pricingData } from "@/lib/data";

const Pricing = () => {
  const container = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref);
  const navigateToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <motion.section
      className="mt-24"
      initial={{ y: -70 }}
      ref={ref}
      id="pricing"
    >
      <div className="container p-5 md:p-16 md:py-0 mx-auto md:pb-16">
        <div className="max-w-[540px] mx-auto">
          <h2 className="section-title-one" ref={container}>
            Pricing
          </h2>
          <p className="section-description mt-5">
            Choose the plan that fits your business needs and unlock powerful
            features, security, and support. Our plans are designed provide more
            value as you scale.
          </p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingData.map(
            (
              {
                title,
                monthlyPrice,
                buttonText,
                popular,
                inverse,
                features,
                x,
                xlast,
              },
              index
            ) => (
              <motion.div
                key={index}
                className={twMerge(
                  "card",
                  inverse === true && "border-white bg-primary text-white/60"
                )}
                style={{
                  backgroundImage: inverse ? "url('/gridwhite.png')" : "none",
                  transform: isInView
                    ? `translateX(${xlast}px)`
                    : `translateX(${x}px)`,
                  opacity: isInView ? 1 : 0,
                  transition: "all 0.9s ease-in-out 0.5s",
                }}
              >
                <div className="flex justify-between">
                  {/* title */}
                  <h3
                    className={twMerge(
                      "text-lg font-bold text-black/50",
                      inverse === true && "text-white"
                    )}
                  >
                    {title}
                  </h3>
                  {popular === true && (
                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20 bg-white">
                      <motion.span
                        className="bg-[linear-gradient(to_right,#FFFFFF,#0000EB,#FFFFFF,#0000EB,#FFFFFF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                        animate={{ backgroundPositionX: "-100%" }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                      >
                        Popular
                      </motion.span>
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mt-[30px]">
                  <span
                    className={twMerge(
                      "tracking-tight font-bold text-black/50",
                      inverse === true && "text-white"
                    )}
                  >
                    From
                  </span>
                  <span className="text-4xl font-bold tracking-tighter leading-none">
                    ${monthlyPrice}
                  </span>
                </div>
                <button
                  className={twMerge(
                    "btn btn-primary w-full mt-[30px]",
                    inverse === true && "bg-white text-black"
                  )}
                  onClick={navigateToContact}
                >
                  {buttonText}
                </button>
                <ul className="flex flex-col gap-5 mt-8">
                  {features.map((feature, index) => {
                    return (
                      <li
                        key={index}
                        className={twMerge(
                          "text-sm flex items-center gap-4 font-medium",
                          inverse === true && "text-white"
                        )}
                      >
                        <CheckIcon size={24} />
                        <span>{feature}</span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Pricing;
