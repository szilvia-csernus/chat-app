"use client";

import { useAppSelector } from "@/redux-store/hooks";
import clsx from "clsx";
import { selectMsgById } from "@/redux-store/features/messagesSlice";

type MessageBoxProps = {
  messageId: string;
  isCurrentMemberSender: boolean;
};

export default function MessageBox({
  messageId,
  isCurrentMemberSender,
}: MessageBoxProps) {
  const message = useAppSelector((state) => selectMsgById(state.messages, messageId));

  if (!message) {
    return null;
  }

  const messageContentClasses = clsx(
    "flex flex-col mt-1 min-w-32 w-auto px-2 py-1 border-1 border-slate-300 dark:border-slate-500",
    {
      "rounded-l-xl rounded-br-xl bg-cyan-50 dark:bg-cyan-800 text-slate-800 dark:text-white":
        isCurrentMemberSender,
      "rounded-r-xl rounded-bl-xl bg-white dark:bg-gray-800":
        !isCurrentMemberSender,
      "bg-gray-200 dark:bg-gray-700": message?.deleted,
    }
  );

  const rendermessageDetails = () => (
    <div
      className={clsx("flex items-center text-secondary dark:text-teal-300")}
    >
      <div className="flex justify-end gap-2 w-full">
        <div className="text-xs">{message?.time}</div>
        {message?.read && isCurrentMemberSender && (
          <div className="text-xs text-gray-400 italic w-auto">
            Seen &#10003;
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {message && (
        <div className={messageContentClasses}>
          <p
            className={clsx(
              "text-sm text-gray-800 dark:text-white whitespace-pre-line",
              {
                "italic text-xs text-gray-500 dark:text-gray-500":
                  message?.deleted,
              }
            )}
          >
            {message?.content}
          </p>
          {rendermessageDetails()}
        </div>
      )}
    </>
  );
}
