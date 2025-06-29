import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { GITHUB_URL, LINKEDIN_URL } from "./Contact";

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Govind";
  const typingSpeed = 150; // milliseconds per character
  const cursorBlinkSpeed = 500; // milliseconds

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    const pauseBeforeDelete = 2000; // pause after completing the word
    const pauseBeforeType = 500; // pause before starting to type again
    const deleteSpeed = 100; // speed of deletion

    const typewriterEffect = () => {
      if (!isDeleting && currentIndex <= fullText.length) {
        // Typing phase
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;

        if (currentIndex > fullText.length) {
          // Finished typing, wait then start deleting
          setTimeout(() => {
            isDeleting = true;
            typewriterEffect();
          }, pauseBeforeDelete);
        } else {
          setTimeout(typewriterEffect, typingSpeed);
        }
      } else if (isDeleting && currentIndex > 0) {
        // Deleting phase
        currentIndex--;
        setDisplayText(fullText.slice(0, currentIndex));
        setTimeout(typewriterEffect, deleteSpeed);
      } else if (isDeleting && currentIndex === 0) {
        // Finished deleting, start typing again
        isDeleting = false;
        setTimeout(typewriterEffect, pauseBeforeType);
      }
    };

    typewriterEffect();
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, cursorBlinkSpeed);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <>
      <div>
        <p className="text-center text-sm font-semibold text-primary-text ">
          The website is going under maintenance. More sections are coming
          soon!.
        </p>
      </div>
      <div
        className="w-full h-[100vh] flex justify-center items-center relative overflow-hidden"
        style={{
          background: `radial-gradient(circle,
    rgba(255, 237, 219, 1) 0%, 
    rgba(255, 237, 219, 1) 70%, 
    rgba(191, 146, 112, 1) 100% `,
        }}
      >
        <div className="z-10 flex flex-col items-center">
          <h1 className="flex flex-col text-4xl font-bold text-center sm:flex-row sm:gap-4 sm:text-6xl lg:text-9xl text-primary-text font-acorn">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center md:flex-row md:gap-4">
                <p>Hi. </p>
                <p>I'm </p>
              </div>
              <span>
                {displayText}
                <span
                  className={`inline-block w-1 h-[1em] bg-primary-text ml-1 ${
                    showCursor ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-100`}
                  style={{ verticalAlign: "text-top" }}
                />
              </span>
            </div>
          </h1>
          <p className="text-4xl font-bold text-center sm:text-6xl lg:text-8xl text-primary-text font-acorn">
            A Developer
          </p>
          <div className="flex flex-col items-center mt-8 text-sm text-center md:max-w-xl md:mt-10 sm:text-md md:text-lg ">
            <p className="font-medium text-primary-text font-secondary">
              Passionate software developer specializing in creating robust,
              user-friendly applications that solve real problems.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 ">
            <a
              href={GITHUB_URL}
              className="cursor-pointer"
              target="_blank"
              aria-label="github_govind"
            >
              <FaGithub className="text-2xl text-primary-text" />
            </a>
            <a
              className="cursor-pointer"
              target="_blank"
              href={LINKEDIN_URL}
              aria-label="linkedin_govind"
            >
              <FaLinkedin className="text-2xl text-primary-text" />
            </a>
          </div>
        </div>
        {/* moving background blur blob */}
        <div
          className="absolute w-[800px] h-[800px] bg-[#FFCDB2] rotate-45 rounded-full blur-3xl shadow-2xl z-0"
          style={{
            top: "10%",
            right: "-10%",
            animation: "blob 10s infinite ease-in-out alternate",
            boxShadow: "0 0 100px rgba(191, 146, 112, 0.5)",
            willChange: "transform opacity",
          }}
        ></div>
        <div
          className="absolute w-[600px] h-[600px] bg-[#FBDB93] rotate-45 rounded-full blur-3xl shadow-2xl  z-0"
          style={{
            top: "0%",
            left: "-10%",
            animation: "newBlob 10s infinite ease-in-out alternate",
            willChange: "transform opacity",
          }}
        ></div>
      </div>
    </>
  );
}
