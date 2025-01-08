"use client";
const pricingData = [
  {
    title: "Basic Plan",
    monthlyPrice: 100,
    buttonText: "Get Started for free",
    popular: false,
    inverse: false,
    features: [
      "Up to 5 project members",
      "unlimited tasks and projects",
      "2GB storage",
      "integrations",
      "Basic support",
    ],
    x: 400,
    xlast: 0,
  },
  {
    title: "Business Plan",
    monthlyPrice: 10,
    buttonText: "Sign up now",
    popular: true,
    inverse: true,
    features: [
      "Up to 5 project members",
      "unlimited tasks and projects",
      "2GB storage",
      "integrations",
      "Basic support",
    ],
    x: -200,
    xlast: 0,
  },
  {
    title: "Stores Plan",
    monthlyPrice: 19,
    buttonText: "Sign up now",
    popular: false,
    inverse: false,
    features: [
      "Up to 5 project members",
      "unlimited tasks and projects",
      "2GB storage",
      "integrations",
      "Basic support",
    ],
    x: -400,
    xlast: 0,
  },
];
import { twMerge } from "tailwind-merge";
import { CheckIcon } from "lucide-react";
import { useInView, motion } from "motion/react";
import { useEffect, useRef } from "react";

const Pricing = () => {
  const container = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    console.log("Element is in view: ", isInView);
  }, [isInView]);
  return (
    <motion.section
      className="mt-24"
      viewport={{ once: true }}
      initial={{ y: -70 }}
      ref={ref}
    >
      <div className="container p-5 md:p-16 md:py-0 mx-auto md:pb-16">
        <div className="max-w-[540px] mx-auto">
          <h2 className="section-title-one" ref={container}>
            Pricing
          </h2>
          <p className="section-description mt-5">
            Free forever. Upgrade for unlimited tasks, better security, and
            exclusive features.
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
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
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
                        // #0000EB,#FFFFFF,#0000EB,#FFFFFF,#0000EB
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
                        <CheckIcon className="h-6 w-6" />
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
