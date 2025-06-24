"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import loginPage from "@/assets/login-page.webp";
import completeProfilePage1 from "@/assets/complete-profile-page-1.webp";
import completeProfilePage2 from "@/assets/complete-profile-page-2.webp";
import membersPageImg from "@/assets/members-page.webp";
import newChatPageImg from "@/assets/new-chat-page.webp";
import chatPageImg from "@/assets/chat-page.webp";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const images = [
  {
    image: loginPage,
    alt: "Screenshot of the login page",
    subtitle: "1. Sign up",
  },
  {
    image: completeProfilePage1,
    alt: "Screenshot of the complete profile page (step 1)",
    subtitle: "2. Complete your profile",
  },
  {
    image: completeProfilePage2,
    alt: "Screenshot of the complete profile page (step 2)",
    subtitle: "3. Upload a profile picture",
  },
  {
    image: membersPageImg,
    alt: "Screenshot of an example members page",
    subtitle: "4. Find a friendly chat partner",
  },
  {
    image: newChatPageImg,
    alt: "Screenshot of an example new chat modal",
    subtitle: "5. Start a new chat",
  },
  {
    image: chatPageImg,
    alt: "Screenshot of an example chat page",
    subtitle: "6. Send messages",
  },
];

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // State to track if the buttons have been touched
  // This is used to prevent the touch events to be triggered when the buttons are clicked
  // and to allow swiping gestures to work properly
  const [buttonTouched, setButtonTouched] = useState(false);

  // Variables to track touch positions
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Function to start the automatic image slideshow
  const startInterval = useCallback(() => {
    // Clear any existing interval before starting a new one
    clearUpInterval();
    const id = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);
    intervalRef.current = id;
  }, []);

  const clearUpInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the interval
    }
    intervalRef.current = null;
  };

  // Automatically start the slideshow when the component mounts
  useEffect(() => {
    startInterval();
    return () => {
      clearUpInterval();
    };
  }, [startInterval]);

  // Handle manual navigations

  const goToPrevious = () => {
    clearUpInterval();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    startInterval(); // Restart the interval
  };

  const goToNext = () => {
    clearUpInterval();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    startInterval();
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    clearUpInterval();
    touchStartX.current = e.touches[0].clientX; // Record the starting touch position
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX; // Update the current touch position
  };

  const handleTouchEnd = () => {
    clearUpInterval();

    if (buttonTouched) {
      setButtonTouched(false);
      return; // Don't process swipe if a button was touched
    }

    const deltaX = touchStartX.current - touchEndX.current; // Calculate the horizontal distance


    // Only trigger navigation if the swipe distance is greater than 50px
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swiping left
        goToNext();
      } else {
        // Swiping right
        goToPrevious();
      }
    }
  };

  return (
    <div
      className="relative w-full h-full rounded-lg mt-3"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <>
        {/* Far Left Image (previous) */}
        {currentImageIndex >= 2 && (
          <div
            key={currentImageIndex - 2}
            className={`absolute -top-12 scale-110 -translate-x-1 translate-y-1/2
              transition-all duration-1000 ease-linear z-90 
              w-full max-w-[calc(100dvw-100px)] h-full sm:min-w-max sm:h-full sm:max-h-[600px]
              font-semibold text-md
              mt-2
              flex flex-col items-center
              `}
            style={{
              zIndex: 1,
              transform: "translateX(-93%) scale(0.2)",
              opacity: 0.3,
              left: "50%", // Center horizontally
              color: "inherit",
            }}
          >
            <h2 className="text-md pb-1 sm:p-5 max-w-[calc(100%-30px)] text-secondary dark:text-teal-200">
              {images[currentImageIndex - 2].subtitle}
            </h2>
            <Image
              src={images[currentImageIndex - 2].image}
              className="object-cover max-w-[calc(min((100%-40px),312px))] max-h-[calc(min((100dvh-300px),480px))] 
            sm:max-w-[350px] sm:max-h-[calc(100dvh-350px)] border-1 border-gray-300 dark:border-gray-700"
              alt={images[currentImageIndex - 2].alt}
              priority={currentImageIndex === (0 || 4)}
            />
          </div>
        )}
        {/* Central Left Image (previous) */}
        {currentImageIndex >= 1 && (
          <div
            key={currentImageIndex - 1}
            className={`absolute -top-12 scale-110 -translate-x-1 translate-y-1/2
              transition-all duration-1000 ease-linear z-90 
              w-full max-w-[calc(100dvw-100px)] h-full sm:min-w-max sm:h-full sm:max-h-[600px]
              font-semibold text-md
              mt-2
              flex flex-col items-center
              `}
            style={{
              zIndex: 2,
              transform: "translateX(-75%) scale(0.7)",
              opacity: 0.6,
              left: "50%", // Center horizontally
              color: "inherit",
            }}
          >
            <h2 className="text-md pb-1 sm:p-5 max-w-[calc(100%-30px)] text-secondary dark:text-teal-200">
              {images[currentImageIndex - 1].subtitle}
            </h2>
            <Image
              src={images[currentImageIndex - 1].image}
              className="object-cover max-w-[calc(min((100%-40px),312px))] max-h-[calc(min((100dvh-300px),480px))] 
            sm:max-w-[350px] sm:max-h-[calc(100dvh-350px)] border-1 border-gray-300 dark:border-gray-700"
              alt={images[currentImageIndex - 1].alt}
              priority={currentImageIndex === (0 || 4)}
            />
          </div>
        )}
        {/* Central Image */}
        <div
          key={currentImageIndex}
          className={`absolute -top-12 scale-110 
              transition-all duration-1000 ease-linear z-100 
              w-full max-w-[calc(100dvw-100px)] h-full sm:min-w-max sm:h-full sm:max-h-[600px]
              font-semibold text-md
              mt-2
              flex flex-col items-center
              `}
          style={{
            zIndex: 3,
            transform: "translateX(-50%) scale(1)",
            opacity: 1,
            left: "50%", // Center horizontally
            color: "inherit",
          }}
        >
          <h2 className="text-md pb-1 sm:p-5 max-w-[calc(100%-30px)] text-secondary dark:text-teal-200">
            {images[currentImageIndex].subtitle}
          </h2>
          <Image
            src={images[currentImageIndex].image}
            className="object-cover max-w-[calc(min((100%-40px),312px))] max-h-[calc(min((100dvh-300px),480px))] 
            sm:max-w-[350px] sm:max-h-[calc(100dvh-350px)] border-1 border-gray-300 dark:border-gray-700"
            alt={images[currentImageIndex].alt}
            priority={currentImageIndex === (0 || 4)}
          />
        </div>
        {/* Central Right Image (next)*/}
        {currentImageIndex < images.length - 1 && (
          <div
            key={currentImageIndex + 1}
            className={`absolute -top-12 scale-110 -translate-x-1 translate-y-1
              transition-all duration-1000 ease-linear z-90 
              w-full max-w-[calc(100dvw-100px)] h-full sm:min-w-max sm:h-full sm:max-h-[600px]
              font-semibold text-md
              mt-2
              flex flex-col items-center
              `}
            style={{
              zIndex: 2,
              transform: "translateX(-20%) scale(0.7)",
              opacity: 0.6,
              left: "50%", // Center horizontally
              color: "inherit",
            }}
          >
            <h2 className="text-md pb-1 sm:p-5 max-w-[calc(100%-30px)] text-secondary dark:text-teal-200">
              {images[currentImageIndex + 1].subtitle}
            </h2>
            <Image
              src={images[currentImageIndex + 1].image}
              className="object-cover max-w-[calc(min((100%-40px),312px))] max-h-[calc(min((100dvh-300px),480px))] 
            sm:max-w-[350px] sm:max-h-[calc(100dvh-350px)] border-1 border-gray-300 dark:border-gray-700"
              alt={images[currentImageIndex + 1].alt}
              priority={currentImageIndex === (0 || 4)}
            />
          </div>
        )}
        {/* Far Right Image (next) */}
        {currentImageIndex < images.length - 2 && (
          <div
            key={currentImageIndex + 2}
            className={`absolute -top-12 scale-110 -translate-x-1 translate-y-1
              transition-all duration-1000 ease-linear z-90 
              w-full max-w-[calc(100dvw-100px)] h-full sm:min-w-max sm:h-full sm:max-h-[600px]
              font-semibold text-md
              mt-2
              flex flex-col items-center
              `}
            style={{
              zIndex: 1,
              transform: "translateX(-5%) scale(0.2)",
              opacity: 0.3,
              left: "50%", // Center horizontally
              color: "inherit",
            }}
          >
            <h2 className="text-md pb-1 sm:p-5 max-w-[calc(100%-30px)] text-secondary dark:text-teal-200">
              {images[currentImageIndex + 2].subtitle}
            </h2>
            <Image
              src={images[currentImageIndex + 2].image}
              className="object-cover max-w-[calc(min((100%-40px),312px))] max-h-[calc(min((100dvh-300px),480px))] 
            sm:max-w-[350px] sm:max-h-[calc(100dvh-350px)] border-1 border-gray-300 dark:border-gray-700"
              alt={images[currentImageIndex + 2].alt}
              priority={currentImageIndex === (0 || 4)}
            />
          </div>
        )}
      </>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        onTouchStart={() => setButtonTouched(true)}
        aria-label="Previous"
        className="absolute -left-2 sm:left-10 top-1/3 transform -translate-y-1/2
         bg-secondary text-white rounded-full p-2 sm:p-4 z-20 drop-shadow-md
         hover:bg-gray-500 transition-background"
      >
        <MdArrowBackIosNew /> {/* Left Arrow */}
      </button>
      <button
        onClick={goToNext}
        onTouchStart={() => setButtonTouched(true)}
        aria-label="Next"
        className="absolute -right-2 sm:right-10 top-1/3 transform -translate-y-1/2
        bg-secondary text-white rounded-full p-2 sm:p-4 z-20 drop-shadow-md
        hover:bg-gray-500 transition-background"
      >
        <MdArrowForwardIos /> {/* Right Arrow */}
      </button>

      {/* Dots */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300
              ${
                currentImageIndex === index
                  ? "bg-secondary dark:bg-teal-200"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
