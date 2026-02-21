"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./EmblaCarouselDotButtons";
import Image from "next/image";
import { motion, useInView } from "motion/react";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type Project = {
  name: string;
  category: string;
  description: string;
  imageLink: string;
  videoLink: string;
  canPlay: boolean;
};

interface EmblaCarouselProps {
  slides: Project[];
  options?: any;
}

const EmblaCarousel = (props: EmblaCarouselProps) => {
  const { slides, options } = props;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    align: "center",
    containScroll: false,
  });
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".project-card-inner") as HTMLElement;
    });
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
                if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0.85, 1).toString();
          const opacity = numberWithinRange(tweenValue, 0.4, 1).toString();
          const node = tweenNodes.current[slideIndex];
          if (node) {
            node.style.transform = `scale(${scale})`;
            node.style.opacity = opacity;
          }
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);
    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [emblaApi, tweenScale]);

  return (
    <div className="relative py-16 md:py-28" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12 md:mb-16 px-4"
      >
        <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-3">
          Portfolio
        </p>
        <h2 className="section-title-one mb-2!">Our Projects</h2>
        <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
          A selection of our recent work across various industries
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="embla-projects" ref={emblaRef}>
          <div className="embla-projects__container">
            {slides.map((project, index) => (
              <div className="embla-projects__slide" key={index}>
                <div className="project-card-inner">
                  <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer">
                    {/* Image */}
                    <Image
                      src={project.imageLink}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Video overlay on hover */}
                    {project.canPlay && (
                      <video
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        loop
                        muted
                        preload="metadata"
                        onMouseEnter={(e) => {
                          (e.target as HTMLVideoElement).play();
                        }}
                        onMouseLeave={(e) => {
                          const v = e.target as HTMLVideoElement;
                          v.pause();
                          v.currentTime = 0;
                        }}
                      >
                        <source src={project.videoLink} type="video/mp4" />
                      </video>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                      <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase bg-white/20 backdrop-blur-md text-white rounded-full border border-white/10">
                        {project.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white text-xl md:text-3xl font-bold mb-1 md:mb-2">
                        {project.name}
                      </h3>
                      <p className="text-white/70 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {project.description}
                      </p>
                    </div>

                    {/* Arrow icon */}
                    <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-primary w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EmblaCarousel;
