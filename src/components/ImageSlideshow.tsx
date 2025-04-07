"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import loginPage from "@/assets/login-page.jpeg";
import completeProfilePage1 from "@/assets/complete-profile-page-1.jpeg";
import completeProfilePage2 from "@/assets/complete-profile-page-2.jpeg";
import membersPageImg from "@/assets/members-page.jpeg";
import newChatPageImg from "@/assets/new-chat-page.jpeg";
import chatPageImg from "@/assets/chat-page.jpeg";

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            className="w-auto h-[420px] sm:h-full object-cover absolute top-0 left-0 scale-110 -translate-x-1 transition-all duration-1000 ease-in-out 
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
    </div>
  );
}
