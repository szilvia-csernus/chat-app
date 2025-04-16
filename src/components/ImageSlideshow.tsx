"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import loginPage from "@/assets/login-page.jpeg";
import completeProfilePage1 from "@/assets/complete-profile-page-1.jpeg";
import completeProfilePage2 from "@/assets/complete-profile-page-2.jpeg";
import membersPageImg from "@/assets/members-page.jpeg";
import newChatPageImg from "@/assets/new-chat-page.jpeg";
import chatPageImg from "@/assets/chat-page.jpeg";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const images = [
  { image: loginPage, alt: "Screenshot of the login page", subtitle: "1. Sign up" },
  {
    image: completeProfilePage1,
    alt: "Screenshot of the complete profile page (step 1)", subtitle: "2. Complete your profile",
  },
  {
    image: completeProfilePage2,
    alt: "Screenshot of the complete profile page (step 2)", subtitle: "3. Upload a profile picture",
  },
  { image: membersPageImg, alt: "Screenshot of an example members page", subtitle: "4. Find a friendly chat partner" },
  { image: newChatPageImg, alt: "Screenshot of an example new chat modal", subtitle: "5. Start a new chat" },
  { image: chatPageImg, alt: "Screenshot of an example chat page", subtitle: "6. Send messages" },
];

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

// Function to start the automatic image slideshow
const startInterval = () => {
  const id = setInterval(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  }, 5000);
  setIntervalId(id);
};

// Automatically start the slideshow when the component mounts
useEffect(() => {
  startInterval();
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, []);

// Handle manual navigations

const goToPrevious = () => {
  if (intervalId) clearInterval(intervalId); // Clear the interval
  setCurrentImageIndex((prevIndex) =>
    prevIndex === 0 ? images.length - 1 : prevIndex - 1
  );
  startInterval(); // Restart the interval
};

const goToNext = () => {
  if (intervalId) clearInterval(intervalId); 
  setCurrentImageIndex((prevIndex) =>
    prevIndex === images.length - 1 ? 0 : prevIndex + 1
  );
  startInterval();
};


  return (
    <div className="relative w-full h-full rounded-lg mt-3">
      {images.map((image, index) => (
        <div key={index}>
          <h2
            className={`absolute -top-12 scale-110 -translate-x-1 translate-y-1
              transition-all duration-1000 ease-in-out z-100 font-semibold text-md min-w-[242px]
              p-1 my-2 bg-teal-600/20`}
            style={{
              zIndex: index === currentImageIndex ? 2 : 0,
              transform:
                index === currentImageIndex
                  ? "translateX(-50%) translateY(0%)"
                  : "translateX(-40%) translateY(100%) ",
              opacity: index === currentImageIndex ? 1 : 0,
              left: "50%", // Center horizontally
              color: "inherit",
            }}
          >
            {image.subtitle}
          </h2>
          <Image
            src={image.image}
            className="w-auto max-w-[calc(100%-100px)] max-h-[calc(100dvh-330px)] sm:h-full sm:max-h-[600px] 
            object-cover absolute top-0 left-0 scale-110 -translate-x-1 
            transition-all duration-1000 ease-in-out 
            border-1 border-slate-300 dark:border-slate-700"
            style={{
              zIndex: index === currentImageIndex ? 1 : 0,
              transform:
                index === currentImageIndex
                  ? "translateX(-50%) scale(1)"
                  : "translateX(-50%) scale(0.8)",
              opacity: index === currentImageIndex ? 1 : 0,
              left: "50%", // Center horizontally
              color: "inherit",
            }}
            alt={image.alt}
            priority={index === 0}
          />
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute -left-2 sm:left-10 top-1/3 transform -translate-y-1/2
         bg-secondary text-white rounded-full p-2 sm:p-4 z-20 
         hover:bg-gray-500 transition-background"
      >
        <MdArrowBackIosNew /> {/* Left Arrow */}
      </button>
      <button
        onClick={goToNext}
        className="absolute -right-2 sm:right-10 top-1/3 transform -translate-y-1/2 
        bg-secondary text-white rounded-full p-2 sm:p-4 z-20 
        hover:bg-gray-500 transition-background"
      >
        <MdArrowForwardIos /> {/* Right Arrow */}
      </button>

      {/* Dots */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
              currentImageIndex === index ? "bg-secondary" : "bg-gray-400"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}
