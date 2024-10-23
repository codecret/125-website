import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import Swiper styles
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

const SwiperComponent = () => {
  const imageSources = [
    "/project1.png",
    "/project2.png",
    "/project3.png",
    "/project4.png",
    "/project5.png",
    "/project6.png",
  ];
  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      cssMode
      className="mySwiper"
      modules={[Autoplay, Pagination, Navigation]}
      //   spaceBetween={20}
      centeredSlides
      loop={true}
      autoplay={{
        delay: 1500,
        disableOnInteraction: false,
      }}
      //   navigation={{
      //     prevEl: ".swiper-button-prev-custom",
      //     nextEl: ".swiper-button-next-custom",
      //   }}
      //   onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      breakpoints={{
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
        1280: {
          slidesPerView: 1,
          spaceBetween: 50,
        },
      }}
    >
      {imageSources.map((src, index) => (
        <SwiperSlide
          key={index}
          //   className={`swiper-slide relative ${
          //     index === activeIndex ? "opacity-100" : "opacity-50"
          //   } transition-opacity duration-300 ease-in-out`}
          //   aria-hidden={index !== activeIndex}
        >
          <div className="h-[240px] rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <Image
              src={src}
              alt={`A screenshot of Project ${
                index + 1
              }, showcasing its features`}
              fill
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperComponent;
