"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@heroui/card";
import ChatThread from "./ChatThread";
import ChatForm from "./ChatForm";
import CurrentChatPartner from "./CurrentChatPartner";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  selectAllMsgsLoadedForCurrentChat,
  selectChatsPopulated,
  selectCurrentChat,
  selectFirstLoadedMsgIdByChatId,
  setCurrentChatId,
} from "@/redux-store/features/chatsSlice";
import {
  fetchDataAndPopulateStore,
  loadMoreMessages,
} from "@/redux-store/thunks";
import PullableSpace from "@/components/PullableSpace";


export default function Chat({ chatId }: { chatId: string }) {
  const populated = useAppSelector(selectChatsPopulated);
  const dispatch = useAppDispatch();

  const currentChat = useAppSelector(state => selectCurrentChat(state.chats));
  const firstLoadedMsgId = useAppSelector((state) =>
    selectFirstLoadedMsgIdByChatId(state, currentChat?.id || null)
  );
  const [cursor, setCursor] = useState<string | null>(firstLoadedMsgId);
  const allMessagesLoaded = useAppSelector(selectAllMsgsLoadedForCurrentChat);

  // used for the first time the chat is opened (if user was not originally
  // signed in when the app first loaded and this is the first page they visit)
  useEffect(() => {
    dispatch(setCurrentChatId(chatId));
    if (!populated) {
      dispatch(fetchDataAndPopulateStore());
    }
  }, [dispatch, populated, chatId]);

  const handlePull = () => {
    if (allMessagesLoaded || !cursor || !currentChat) return;
    dispatch(loadMoreMessages(currentChat.id, cursor)); // Fetch more messages when scrolled to the top
  };

  useEffect(() => {
    setCursor(firstLoadedMsgId);
  }, [firstLoadedMsgId]);

  const messageEndRef = useRef<HTMLDivElement>(null);
  function scrollToBottom() {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <Card
      radius="none"
      className="h-[calc(100dvh-80px)] m-0 border-1 border-slate-300 dark:border-slate-700 bg-zig-zag"
    >
      <div className="sticky space-x-2 sm:hidden">
        <CurrentChatPartner />
      </div>
      <div className="flex flex-col-reverse h-svh overflow-y-scroll overscroll-y-contain touch-pan-y scrollbar-hide scroll-smooth">
        {/* Pullable space */}
        <PullableSpace
          onPull={handlePull}
          allMessagesLoaded={allMessagesLoaded}
        >
          {allMessagesLoaded && (
            <div className="text-center text-xs pt-4">
              This is the start of the conversation
            </div>
          )}
          <ChatThread />
          {/* Ref to mark the end of the conversation */}
          <div ref={messageEndRef} />
        </PullableSpace>
        {/* Chat thread */}
      </div>
      <div className="sticky mb-3">
        {currentChat?.inactive && (
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-3 text-center text-sm">
            This chat is inactive. Your chat partner has deleted their account.
          </div>
        )}
        {!currentChat?.inactive && <ChatForm scrollToBottom={scrollToBottom} />}
      </div>
    </Card>
  );
}
