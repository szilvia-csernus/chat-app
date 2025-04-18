'use client';

import { useEffect } from "react";

export default function useViewportReset() {
  useEffect(() => {
    const resetViewport = () => {
      const viewportMeta = document.querySelector("meta[name=viewport]");
      if (viewportMeta) {
        viewportMeta.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        );
      }
    };

    const handleGestureEnd = () => {
      // iOS-specific pinch-to-zoom gesture
      resetViewport();
    };

    const handleTouchEnd = () => {
      // Reset viewport after touch interaction ends
      resetViewport();
    };

    // Add event listeners
    window.addEventListener("gestureend", handleGestureEnd); // iOS Safari-specific
    window.addEventListener("touchend", handleTouchEnd); // Cross-browser fallback

    return () => {
      // Clean up event listeners
      window.removeEventListener("gestureend", handleGestureEnd);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
}
