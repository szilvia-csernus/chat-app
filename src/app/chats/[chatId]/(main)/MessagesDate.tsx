import { timeAgoDate} from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function MessagesDate({ dateString }: { dateString: string }) {
  const [messagesDate, setMessagesDate] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const calculateTimeUntilMidnight = () => {
      const timeUntilMidnight = new Date(new Date().setHours(24, 0, 0, 0)).getTime() - Date.now();
      if (timeUntilMidnight <= 0) { 
        return (1000 * 60 * 60 * 24)
      } else 
      return timeUntilMidnight; 
    };

    const updateMessagesDate = () => {
      setMessagesDate(timeAgoDate(dateString));

      // Schedule the next update
      const nextInterval = calculateTimeUntilMidnight();
      timeout = setTimeout(updateMessagesDate, nextInterval);
    };

    updateMessagesDate();

    return () => {
      clearTimeout(timeout); // Cleanup the timeout
    };
  }, [dateString]);

  return <span>{messagesDate}</span>;
}