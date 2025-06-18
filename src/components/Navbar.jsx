import React, { useEffect, useRef, useState } from "react";
import useContactStore from "../store/useContactStore";

const navItems = [
  { name: "Home", path: "/" },
  // { name: "About", path: "#" },
  // { name: "Projects", path: "#" },
  { name: "Contact", path: "#" },
];

export default function Navbar() {
  const navRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderStyle, setSliderStyle] = useState({
    width: 0,
    left: 0,
  });
  const { setOpenContactModal } = useContactStore();

  const updateSliderPosition = (index) => {
    if (navRefs.current[index]) {
      const navElement = navRefs.current[index];
      const navRect = navElement.getBoundingClientRect();
      const parentRect =
        navElement.parentElement.parentElement.getBoundingClientRect();

      setSliderStyle({
        width: navRect.width,
        left: navRect.left - parentRect.left,
      });
    }
  };

  // Update slider position on mount and when active index changes
  useEffect(() => {
    updateSliderPosition(activeIndex);

    // Add window resize listener
    const handleResize = () => updateSliderPosition(activeIndex);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeIndex]);

  const handleNavClick = (index, e) => {
    e.preventDefault();
    setActiveIndex(index);
    if (navItems[index].name === "Contact") {
      setOpenContactModal(true);
    }
  };

  return (
    <div className="fixed left-0 right-0 z-10 flex justify-center top-10">
      <div className="p-2 px-4 w-fit">
        <div className="relative px-2">
          <ul className="relative flex">
            {navItems.map((item, index) => {
              if (index === 0 && item.name === "Home") {
                return (
                  <li key={index} className="relative z-10">
                    <a
                      key={item.name}
                      ref={(el) => (navRefs.current[index] = el)}
                      href={item.path}
                      className={`flex gap-2 items-center text-xs sm:text-sm md:text-base px-2 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 font-medium transition-colors duration-300 text-[#6F4E37]`}
                      onClick={(e) => handleNavClick(index, e)}
                      aria-label={`Navigate to ${item.name}`}
                    >
                      {item.name}

                      <p className="inline-block px-2 shadow">/</p>
                    </a>
                  </li>
                );
              }
              return (
                <li key={index} className="relative z-10">
                  <a
                    key={item.name}
                    ref={(el) => (navRefs.current[index] = el)}
                    href={item.path}
                    className={`block text-xs sm:text-sm md:text-base px-2 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 font-medium transition-colors duration-300 text-[#6F4E37]`}
                    onClick={(e) => handleNavClick(index, e)}
                    aria-label={`Navigate to ${item.name}`}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
          <div
            className="absolute z-0 transition-all duration-300 ease-in-out transform -translate-y-1/2 bg-white top-1/2 backdrop-blur-2xl rounded-4xl h-4/5"
            style={{
              width: `${sliderStyle.width}px`,
              left: `${sliderStyle.left}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
