"use client";

import { selectIsActive, setIsActive } from "@/redux-store/features/currentMemberSlice";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { useCallback, useEffect } from "react";

export function useActivityChange(): boolean {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector(selectIsActive);
  console.log("useActivityChange: activity state", isActive);

  const handleFocus = useCallback(() => {
    console.log("focus event fired");
    dispatch(setIsActive(true));
  }, [dispatch]);

  const handleBlur = useCallback(() => {
    console.log("blur event fired");
    dispatch(setIsActive(false));
  }, [dispatch]);

  const handleOnline = useCallback(() => {
    console.log("online event fired");
    dispatch(setIsActive(document.visibilityState === "visible"));
  }, [dispatch]);

  const handleOffline = useCallback(() => {
    console.log("offline event fired");
    dispatch(setIsActive(false));
  }, [dispatch]);

  const handleFreeze = useCallback(() => {
    console.log("freeze event fired");
    dispatch(setIsActive(false));
  }, [dispatch]);

  const handleResume = useCallback(() => {
    console.log("resume event fired");
    dispatch(setIsActive(document.visibilityState === "visible"));
  }, [dispatch]);

  // const handleVisibilityChange = useCallback(() => {
  //   console.log("visibility change event fired");
  //   dispatch(setIsActive(document.visibilityState === "visible"));
  // }, [dispatch]);

  useEffect(() => {
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
  }, [
    dispatch,
    handleFocus,
    handleBlur,
    handleOnline,
    handleOffline,
    handleFreeze,
    handleResume,
  ]);

  return isActive;
}
