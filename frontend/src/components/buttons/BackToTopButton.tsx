"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // optional icon

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed cursor-pointer bottom-6 right-6 p-3 rounded-full border border-1 bg-black text-white shadow-lg hover:bg-gray-800 transition-all"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
