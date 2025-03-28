import React, { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "@heroui/react";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  onPull: () => void; // Callback triggered when pull threshold is reached
  distanceFromTop: number; // Distance from the top of the screen to the top of the pullable space
  debounceDelay?: number; // Delay for the debounce function
  allMessagesLoaded: boolean;
  children?: React.ReactNode;
};

export default function PullableSpace({
  onPull,
  distanceFromTop,
  debounceDelay = 1000,
  allMessagesLoaded,
  children,
}: Props) {
  const [containerHeight, setContainerHeight] = useState(0); // Used to dynamically set the height of the spinner's container
  const isOverThresholdRef = useRef(false); // Whether the pulled container's size exceeds the threshold

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const beginningRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false); // Synchronous loading state to prevent race conditions
  const scrollStopTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for detecting scroll stop

  // Helper function to check if `beginningRef` is rendered at the top
  const checkIfAtTop = useCallback(() => {
    const container = beginningRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const isAtTop = rect.top >= distanceFromTop;
      return isAtTop;
    }
    return false;
  }, [distanceFromTop]);


  // Debounced function for message loading
  const debouncedOnPull = useDebouncedCallback(() => {
    if (allMessagesLoaded)
      return;
    onPull(); // Trigger the onPull callback
    timeoutRef.current = setTimeout(() => {
      loadingRef.current = false;
      setContainerHeight(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += 1; // Scroll back slightly to enable scrolling upwards again
      }
    }, 2000); // Simulate loading time
  }, debounceDelay);

  // Handle the scroll event
  const handleScroll = useCallback(() => {
    if (allMessagesLoaded)
      return;

    if (checkIfAtTop() && !loadingRef.current) {
      loadingRef.current = true;
      setContainerHeight(150);
    }

    // Clear any existing timeout for detecting scroll stop
    if (scrollStopTimeoutRef.current) {
      clearTimeout(scrollStopTimeoutRef.current);
    }

    // Set a timeout to detect when scrolling stops
    scrollStopTimeoutRef.current = setTimeout(() => {
      if (checkIfAtTop() && !allMessagesLoaded) {
        debouncedOnPull(); // Call the debounced function
      }
    }, debounceDelay); 
  }, [allMessagesLoaded, debouncedOnPull,  checkIfAtTop, debounceDelay]);


  // Cleanup the timeout on unmount
  useEffect(() => {
    return () => {
      loadingRef.current = false; // Reset loading state
      isOverThresholdRef.current = false; // Reset the threshold state
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
