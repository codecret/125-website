import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { sendEmail } from "@/lib/email";
import { motion, useInView } from "framer-motion";
import { slideIn } from "../utils/motion";

const ContactUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, message } = formData;

    if (!firstName || !lastName || !email || !phone || !message) {
      alert("All fields are required.");
      return;
    }

    const body = `
      First Name: ${firstName}
      Last Name: ${lastName}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `;

    try {
      await sendEmail({
        to: "hello@codecret.com",
        subject: "Contact Us Message",
        body,
      });
      alert("Message sent successfully!");
    } catch (error) {
      alert("Error sending message, please try again.");
    }
  };

  return (
    <div
      ref={ref}
      className="container md:p-10 my-20 mx-auto md:flex justify-center relative overflow-hidden "
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover	bg-no-repeat bg-center opacity-5 -z-30"
        style={{
          backgroundImage: "url('/grid.png')",
        }}
      ></div>
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="relative w-full md:w-[30%] md:mr-20 z-99 text-center md:text-left md:bg-white md:shadow-[0_4px_38px_10px_rgba(82,103,156,0.1)] py-2 rounded-xl overflow-hidden"
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
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
      </motion.div>
      <motion.form
        onSubmit={handleSubmit}
        className="w-full md:w-[40%] flex flex-col gap-6 z-99 mt-10 md:mt-0 px-10 md:p-0"
        variants={slideIn("right", "tween", 0.2, 1)}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        <div className="flex gap-5">
          <div className="flex flex-col flex-1">
            <label htmlFor="firstName">First name</label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              type="text"
              className="bg-gray-50"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="lastName">Last name</label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              type="text"
              className="bg-gray-50"
            />
          </div>
        </div>
        <label htmlFor="email">Email</label>
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          className="bg-gray-50"
        />
        <label htmlFor="phone">Phone number</label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="number"
          className="bg-gray-50"
        />
        <label htmlFor="message">Message</label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="bg-gray-50"
        />
        <button
          onClick={handleSubmit}
          className="p-2 w-full bg-primary rounded-lg mt-5 text-white "
          style={{
            boxShadow: "inset 4px 9px 36px rgba(255, 255, 255, 0.8)",
          }}
        >
          Send Message
        </button>
      </motion.form>
    </div>
  );
};

export default ContactUs;
