"use client";
const pricingData = [
  {
    title: "Basic Plan",
    monthlyPrice: 200,
    buttonText: "Get Started for Free",
    popular: false,
    inverse: false,
    features: [
      "1 Custom Website Design",
      "Up to 5 pages",
      "Basic SEO optimization",
      "Mobile responsiveness",
      "Cross-Browser Support",
      "Email support",
      "1-year free domain",
      "Lifetime free SSL certificate",
    ],
    x: 400,
    xlast: 0,
  },
  {
    title: "Business Plan",
    monthlyPrice: 500,
    buttonText: "Get Started Now",
    popular: true,
    inverse: true,
    features: [
      "Includes Basic Plan",
      "Custom Website Design",
      "Advanced SEO",
      "Performance Optimization",
      "Custom Code Functionality",
      "Advanced Analytics Integration",
      "Priority Email Support",
      "Content Management System (CMS)",
      "Team Collaboration Features",
    ],
    x: -200,
    xlast: 0,
  },
  {
    title: "Stores Plan",
    monthlyPrice: 400,
    buttonText: "Get Started Now",
    popular: false,
    inverse: false,
    features: [
      "Includes Basic Plan",
      "Custom Website Design",
      "Premium SEO",
      "Inventory Management",
      "E-commerce Setup & Integration",
      "Advanced Analytics & Reporting",
      "Dedicated Project Manager Support",
      "Priority Email Support",
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
  const isInView = useInView(ref);

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
