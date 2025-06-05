"use client";

import { selectIsActive, setIsActive } from "@/redux-store/features/currentMemberSlice";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { useCallback, useEffect } from "react";

export function useActivityChange(): boolean {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector(selectIsActive);

  const handleFocus = useCallback(() => {
    dispatch(setIsActive(true));
  }, [dispatch]);

  const handleBlur = useCallback(() => {
    dispatch(setIsActive(false));
  }, [dispatch]);

  const handleOnline = useCallback(() => {
    dispatch(setIsActive(document.visibilityState === "visible"));
  }, [dispatch]);

  const handleOffline = useCallback(() => {
    dispatch(setIsActive(false));
  }, [dispatch]);

  const handleFreeze = useCallback(() => {
    dispatch(setIsActive(false));
  }, [dispatch]);

  const handleResume = useCallback(() => {
    dispatch(setIsActive(document.visibilityState === "visible"));
  }, [dispatch]);

  const handleVisibilityChange = useCallback(() => {
    dispatch(setIsActive(document.visibilityState === "visible"));
  }, [dispatch]);

  useEffect(() => {
    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("freeze", handleFreeze);
    document.addEventListener("resume", handleResume);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("freeze", handleFreeze);
      document.removeEventListener("resume", handleResume);
    };
  }, [
    dispatch,
    handleVisibilityChange,
    handleFocus,
    handleBlur,
    handleOnline,
    handleOffline,
    handleFreeze,
    handleResume,
  ]);

  return isActive;
}
