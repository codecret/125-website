import avatar1 from "@/assets/people/khaled.jpeg";
import avatar2 from "@/assets/people/ahmad.png";
import avatar3 from "@/assets/people/mayyar.jpg";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-7.png";
import avatar6 from "@/assets/avatar-7.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";

const data = {
  personal: {
    logo: "/logo.svg",
  },
  socialMedia: {
    instagram: "codecret",
    x: "codecret",
    whatsapp: "0561231217",
    email: "hello@codecret.com",
  },
};

const menus = [
  { title: "Pricing", path: "#pricing" },
  { title: "Testimonials", path: "#testimonials" },
];

const pricingData = [
  {
    title: "Basic Plan",
    monthlyPrice: 500,
    buttonText: "Get Started now",
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
    monthlyPrice: 1000,
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
    monthlyPrice: 800,
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
const projects = [
  {
    name: "Orseda",
    category: "System",
    description: "Software management system",
    imageLink: "/project2.png",
    videoLink: "/orseda.mp4",
    canPlay: true,
  },
  {
    name: "Hora",
    category: "System",
    description: "Appointment Booking system.",
    imageLink: "/project3.png",
    videoLink: "/project3.png",
    canPlay: false,
  },
  {
    name: "Dal Alkhair",
    category: "Marketing platform",
    description: "Digital Donation Platform",
    imageLink: "/project6.png",
    videoLink: "/project6.png",
    canPlay: false,
  },
  {
    name: "Emi",
    category: "E-commerce",
    description: "E-commerce platform",
    imageLink: "/emi.png",
    videoLink: "/emi.png",
    canPlay: false,
  },
  {
    name: "EcoX",
    category: "Application",
    description: "Application for the recycling of waste",
    imageLink: "/project1.png",
    videoLink: "/project1.png",
    canPlay: false,
  },
];
export { data, menus, pricingData, testData, projects };
