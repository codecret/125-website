import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";

const ContactUs = () => {
  return (
    <div className="container p-10 my-20 md:p-16 mx-auto md:flex justify-center relative ">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover	bg-no-repeat bg-center opacity-5 -z-30"
        style={{
          backgroundImage: "url('/grid.png')",
        }}
      ></div>
      <div className="relative w-full md:w-[30%] md:mr-20 z-99 text-center md:text-left md:bg-white md:shadow-[0_4px_58px_20px_rgba(82,103,156,0.1)] py-2 rounded-xl overflow-hidden">
        {/* section-heading */}
        <div className="px-10">
          <h2 className="section-title-one mt-5 text-center md:text-left">
            Contact Us
          </h2>
          <p className="section-description text-center md:text-left font-normal">
            From intutive design to powerful features, our apps has become an
            essential tools for users around the world
          </p>
        </div>
        <Image
          src="/Earth.svg"
          alt="My SVG Image"
          width="300"
          height="300"
          objectPosition="left"
          className="absolute -translate-x-[50%] dragAndDropImage2 flowBlock -left-[12%]"
        />
      </div>
      <div className="w-full md:w-[40%] flex flex-col gap-6 z-99 mt-10 md:mt-0">
        <div className="flex gap-5">
          <div className="flex flex-col flex-1">
            <label htmlFor="firstName">First name</label>
            <Input type="text" className="bg-gray-50" />
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="lastName">Last name</label>
            <Input type="text" className="bg-gray-50" />
          </div>
        </div>
        <label htmlFor="email">Email</label>
        <Input type="email" className="bg-gray-50" />
        <label htmlFor="phone">Phone number</label>
        <Input type="number" className="bg-gray-50" />
        <label htmlFor="message">Message</label>
        <Textarea className="bg-gray-50" />
        <button
          className="p-2 w-full bg-primary rounded-lg mt-5 text-white "
          style={{
            boxShadow: "inset 4px 9px 36px rgba(255, 255, 255, 0.8)",
          }}
        >
          Send Message
        </button>
        {/* <Button /> */}
      </div>
    </div>
  );
};

export default ContactUs;
