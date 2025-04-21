"use client";

import { timeAgoDateTime } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

type LastSeenProps = {
  dateString: string; // Original date string
};

export default function LastSeen({ dateString }: LastSeenProps) {
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  const calculateNextInterval = (date: string) => {
    const elapsed = Date.now() - new Date(date).getTime();
    // for 1 hour, the interval is 1 minute
    if (elapsed < 60 * 60 * 1000) return 60000; // 1 minute
    // if elapsed is >= to 1 hour, set the interval to 60 minutes
    return 3600000; // 60 minutes
  };

  useEffect(() => { 
    const updateLastSeen = () => {
      setLastSeen(timeAgoDateTime(dateString));

      // Schedule the next update
      const nextInterval = calculateNextInterval(dateString);
      timeOut.current = setTimeout(updateLastSeen, nextInterval);
    };

    updateLastSeen();

    return () => {
      clearTimeout(timeOut.current!); // Cleanup the timeout
    };
  }, [dateString]);

  return <span suppressHydrationWarning>{lastSeen}</span>;
}
