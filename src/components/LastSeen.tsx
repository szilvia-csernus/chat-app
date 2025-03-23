"use client";

import {
  timeAgoDateTime,
} from "@/lib/utils";
import React, { useEffect, useState } from "react";

type LastSeenProps = {
  dateString: string; // Original date string
};

export default function LastSeen({
  dateString,
}: LastSeenProps) {
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const calculateNextInterval = (date: string) => {
      const elapsed = Date.now() - new Date(date).getTime();
      if (elapsed < 2 * 60 * 1000) return 60000; // 1 minute
      if (elapsed < 5 * 60 * 1000) return 120000; // 2 minutes
      if (elapsed < 10 * 60 * 1000) return 300000; // 5 minutes
      if (elapsed < 30 * 60 * 1000) return 600000; //  10 minutes
      if (elapsed < 60 * 60 * 1000) return 1800000; // 30 minutes
      return 3600000; // 60 minutes
    };

    const updateLastSeen = () => {
      // Otherwise, update the "last seen" value
      setLastSeen(timeAgoDateTime(dateString));

      // Schedule the next update
      const nextInterval = calculateNextInterval(dateString);
      timeout = setTimeout(updateLastSeen, nextInterval);
    };

    updateLastSeen();

    return () => {
      clearTimeout(timeout); // Cleanup the timeout
    };
  }, [dateString]);

  return <span suppressHydrationWarning >{lastSeen}</span>;
}
