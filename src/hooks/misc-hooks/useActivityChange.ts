"use client";

import { selectIsActive, setIsActive } from "@/redux-store/features/currentMemberSlice";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { useEffect } from "react";

export function useActivityChange(): boolean {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector(selectIsActive);
  console.log("useActivityChange: activity state", isActive);

  useEffect(() => {
    // const handleVisibilityChange = () => {
    //   console.log("visibility change event fired");
    //   dispatch(setIsActive(document.visibilityState === "visible"));
    // };

    const handleFocus = () => {
      console.log("focus event fired");
      dispatch(setIsActive(true));
    };

    const handleBlur = () => {
      console.log("blur event fired");
      dispatch(setIsActive(false));
    };

    const handleOnline = () => {
      console.log("online event fired");
      dispatch(setIsActive(document.visibilityState === "visible"));
    };

    const handleOffline = () => {
      console.log("offline event fired");
      dispatch(setIsActive(false));
    };

    const handleFreeze = () => {
      console.log("freeze event fired");
      dispatch(setIsActive(false));
    };

    const handleResume = () => {
      console.log("resume event fired");
      dispatch(setIsActive(document.visibilityState === "visible"));
    };

    // Add event listeners
    // document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("freeze", handleFreeze);
    document.addEventListener("resume", handleResume);

    // Cleanup
    return () => {
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("freeze", handleFreeze);
      document.removeEventListener("resume", handleResume);
    };
  }, [dispatch]);

  return isActive;
}
