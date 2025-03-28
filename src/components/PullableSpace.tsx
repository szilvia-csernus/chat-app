import React, { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "@heroui/react";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  onPull: () => void; // Callback triggered when pull threshold is reached
  threshold?: number; // Pull distance threshold to trigger the callback
  distanceFromTop: number; // Distance from the top of the screen to the top of the pullable space
  debounceDelay?: number; // Delay for the debounce function
  allMessagesLoaded: boolean;
  children?: React.ReactNode;
};

export default function PullableSpace({
  onPull,
  threshold = 100, // Threshold is how far the user needs to pull down to trigger the callback
  distanceFromTop,
  debounceDelay = 1000,
  allMessagesLoaded,
  children,
}: Props) {
  const [containerHeight, setContainerHeight] = useState(0); // Used to dynamically set the height of the spinner's container
  const touchStartYRef = useRef(0);
  const atTopRef = useRef(false);
  const isOverThresholdRef = useRef(false); // Whether the pulled container's size exceeds the threshold

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const beginningRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false); // Synchronous loading state to prevent race conditions
  const scrollStopTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for detecting scroll stop

  // Helper function to check if `beginningRef` is rendered at the top
  const checkIfAtTop = () => {
    const container = beginningRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const isAtTop = rect.top >= distanceFromTop; // we have to adjust for the debounce delay, otherwise the reaching the top event may be missed.
      console.log("Bounding rect:", rect);
      console.log("At top:", isAtTop);
      if (isAtTop) {
        atTopRef.current = true;
      } else {
        atTopRef.current = false;
      }
      return isAtTop;
    }
    return false;
  };

  const setLoadingOn = () => {
    loadingRef.current = true;
    setContainerHeight(threshold);
  };

  const setLoadingOff = () => {
    loadingRef.current = false;
    setContainerHeight(0);
  };

  // Debounced function for message loading
  const debouncedOnPull = useDebouncedCallback(() => {
    if (allMessagesLoaded)
      return;
    onPull(); // Trigger the onPull callback
    timeoutRef.current = setTimeout(() => {
      setLoadingOff();
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += 1; // Scroll back slightly to enable scrolling upwards again
      }
    }, 1000); // Simulate loading time
  }, debounceDelay);

  // Handle the scroll event
  const handleScroll = useCallback(() => {
    if (allMessagesLoaded)
      return;
    console.log("Scroll event fired");

    if (checkIfAtTop() && !loadingRef.current) {
      setLoadingOn();
    }

    // Clear any existing timeout for detecting scroll stop
    if (scrollStopTimeoutRef.current) {
      clearTimeout(scrollStopTimeoutRef.current);
    }

    // Set a timeout to detect when scrolling stops
    scrollStopTimeoutRef.current = setTimeout(() => {
      console.log("Scrolling stopped");
      if (checkIfAtTop() && !allMessagesLoaded) {
        debouncedOnPull(); // Call the debounced function
      }
    }, debounceDelay); 
  }, [allMessagesLoaded, debouncedOnPull]);

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (loadingRef.current) return;

    touchStartYRef.current = e.touches[0].clientY; // the starting Y position
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (loadingRef.current) return;
    const currentY = e.touches[0].clientY;
    // Calculate downward pull distance with a max value of the threshold
    const distance = Math.min(
      threshold,
      Math.max(0, currentY - touchStartYRef.current) // user pulling down not up
    );
    if (checkIfAtTop()) {
      setContainerHeight(distance);
      if (distance >= threshold) {
        // If the pull distance reaches the threshold
        isOverThresholdRef.current = true;
        setLoadingOn();
      } else {
        isOverThresholdRef.current = false;
      }
    } else {
      isOverThresholdRef.current = false; // Reset the threshold state if not at the top
    }
  };

  const handleTouchEnd = () => {
    if (isOverThresholdRef.current && !allMessagesLoaded) {
      // Trigger the callback if pull container height exceeds the threshold
      onPull();
      timeoutRef.current = setTimeout(() => {
        isOverThresholdRef.current = false;
        setLoadingOff();
      }, 1000);
    } else {
      // Reset loading if it doesn't exceed the threshold or there's no more message
      setLoadingOff();
    }
  };

  // Cleanup the timeout on unmount
  useEffect(() => {
    return () => {
      loadingRef.current = false; // Reset loading state
      isOverThresholdRef.current = false; // Reset the threshold state
      atTopRef.current = false; // Reset the top state
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Cleanup timeout on unmount
      }
      if (scrollStopTimeoutRef.current) {
        clearTimeout(scrollStopTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="pointer-events-auto flex flex-col overflow-y-scroll touch-pan-y scrollbar-hide scroll-smooth"
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ref marking the beginning of the conversation */}
      <div
        ref={beginningRef}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          transition: "height 300ms ease",
          height: `${containerHeight}px`, // Dynamically set the height inlined
        }}
      >
        {loadingRef.current && <Spinner size="lg" className="mt-2"/>}
      </div>
      {children}
    </div>
  );
}
