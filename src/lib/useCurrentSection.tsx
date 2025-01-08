import { useEffect, useState } from "react";

export function useCurrentSection() {
  const [currentSection, setCurrentSection] = useState<string>("ABOUT");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>("section");
      let activeSection = "ABOUT";
      let maxVisibleArea = 0;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight =
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visibleArea = Math.max(0, visibleHeight);

        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          activeSection = section.getAttribute("id") || "ABOUT";
        }
      });

      setCurrentSection(activeSection.toUpperCase());
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return currentSection;
}
