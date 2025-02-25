import { MutableRefObject, useEffect, useRef, useState } from "react";

export function useActivityChange(): boolean {
  const isActive = useRef<boolean>(true);
  console.log("useActivityChange: activity state", isActive.current);

  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log("visibility change event fired");
      isActive.current = document.visibilityState === "visible";
    };

    const handleFocus = () => {
      console.log("focus event fired");
      isActive.current = true;
    };

    const handleBlur = () => {
      console.log("blur event fired");
      isActive.current = false;
    };

    const handleOnline = () => {
      console.log("online event fired");
      isActive.current = document.visibilityState === "visible";
    };

    const handleOffline = () => {
      console.log("offline event fired");
      isActive.current = false;
    };

    const handleFreeze = () => {
      console.log("freeze event fired");
      isActive.current = false;
    };

    const handleResume = () => {
      console.log("resume event fired");
      isActive.current = document.visibilityState === "visible";
    };

    // Set initial state
    // handleVisibilityChange();

    // Add event listeners
    // document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    // @ts-ignore - Experimental API
    document.addEventListener("freeze", handleFreeze);
    // @ts-ignore - Experimental API
    document.addEventListener("resume", handleResume);

    // Cleanup
    return () => {
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // @ts-ignore - Experimental API
      document.removeEventListener("freeze", handleFreeze);
      // @ts-ignore - Experimental API
      document.removeEventListener("resume", handleResume);
    };
  }, []);

  return isActive.current;
}
