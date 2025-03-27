import React, { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "@heroui/react";

type Props = {
  onPull: () => void; // Callback triggered when pull threshold is reached
  threshold?: number; // Pull distance threshold to trigger the callback
  distanceFromTop?: number; // Distance from the top of the screen to the top of the pullable space
  allMessagesLoaded: boolean;
  children?: React.ReactNode;
};

export default function PullableSpace({
  onPull,
  threshold = 100, // Threshold is how far the user needs to pull down to trigger the callback
  distanceFromTop = 147,
  allMessagesLoaded,
  children,
}: Props) {
  const [containerHeight, setContainerHeight] = useState(0); // Used to dynamically set the height of the spinner's container
  const touchStartYRef = useRef(0);
  const atTopRef = useRef(false);
  const isOverThresholdRef = useRef(false); // Whether the pulled container's size exceeds the threshold
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const beginningRef = useRef<HTMLDivElement>(null);

  // Helper function to check if `beginningRef` is rendered at the top
  const checkIfAtTop = () => {
    if (beginningRef.current) {
      const rect = beginningRef.current.parentElement?.getBoundingClientRect();

      // Check if the element is within the viewport
      const isRendered = rect?.top ? rect.top >= distanceFromTop : false;
      console.log("At top:", isRendered);
      atTopRef.current = isRendered;
      return isRendered;
    }
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      touchStartYRef.current = e.touches[0].clientY; // the starting Y position
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      const currentY = e.touches[0].clientY;
      // Calculate downward pull distance with a max value of the threshold
      const distance = Math.min(
        threshold,
        Math.max(0, currentY - touchStartYRef.current) // user pulling down not up
      );
      if (checkIfAtTop()) {
        setContainerHeight(distance);
        if (distance === threshold) {
          // If the pull distance reaches the threshold
          isOverThresholdRef.current = true;
          setLoading(true);
        }
      }
    },
    [threshold]
  );

  const handleTouchEnd = useCallback(() => {
    if (isOverThresholdRef.current && !allMessagesLoaded) {
      setLoading(true);
      // Trigger the callback if pull container height exceeds the threshold
      onPull();
      timeoutRef.current = setTimeout(() => {
        isOverThresholdRef.current = false;
        setContainerHeight(0);
        setLoading(false);
      }, 1000);
    } else {
      // Reset loading if it doesn't exceed the threshold
      setLoading(false);
      setContainerHeight(0);
    }
  }, [setContainerHeight, onPull]);

  useEffect(() => {
    if (loading) {
      setContainerHeight(threshold);
    } else {
      setContainerHeight(0);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Cleanup timeout on unmount
      }
    };
  }, []);


  return (
    <div
      className="pointer-events-auto flex flex-col"
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
        {loading && <Spinner />}
      </div>
      {children}
    </div>
  );
}
