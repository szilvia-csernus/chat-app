"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@heroui/card";
import ChatThread from "./ChatThread";
import ChatForm from "./ChatForm";
import CurrentChatPartner from "./CurrentChatPartner";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import {
  selectAllOldMsgsLoadedForCurrentChat,
  selectChatsPopulated,
  selectCurrentChat,
  selectFirstLoadedMsgIdByChatId,
  setCurrentChatId,
} from "@/redux-store/features/chatsSlice";
import {
  fetchDataAndPopulateStore,
  loadMoreMessages,
} from "@/redux-store/thunks";
import InfiniteScroll from "@/components/InfiniteScroll";
import { selectLastMessageInFocus, setLastMessageInFocus } from "@/redux-store/features/uiSlice";
import { updateLastChatId } from "@/app/actions/chatActions";
import { formatShortDateTime } from "@/lib/utils";
import { updateMemberWithLastActiveTime } from "@/redux-store/features/membersSlice";


type Props = {
  chatId: string;
  chatPartnerLastActive: Date | null;
}

export default function Chat({ chatId, chatPartnerLastActive }: Props) {
  const populated = useAppSelector(selectChatsPopulated);
  const dispatch = useAppDispatch();

  const currentChat = useAppSelector((state) => selectCurrentChat(state.chats));

  useEffect(() => {
    if (currentChat && chatPartnerLastActive) {
      // Update the last active time of the chat partner
      const lastActive = formatShortDateTime(chatPartnerLastActive);
      dispatch(
        updateMemberWithLastActiveTime({
          id: currentChat.chatPartnerId,
          lastActive,
        })
      );
    }
  }, [currentChat, chatPartnerLastActive, dispatch]);
  

  const firstLoadedMsgId = useAppSelector((state) =>
    selectFirstLoadedMsgIdByChatId(state, currentChat?.id || null)
  );
  // This is the ID of the oldest message that was loaded.
  // It's used to load more messages
  const [cursor, setCursor] = useState<string | null>(firstLoadedMsgId);
  const allMessagesLoaded = useAppSelector(
    selectAllOldMsgsLoadedForCurrentChat
  );
  const lastMessageInFocus = useAppSelector(selectLastMessageInFocus);

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
    dispatch(setLastMessageInFocus(false));
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
    if (lastMessageInFocus) {
      scrollToBottom();
    }
  }); // No dependency array! This is because we want to scroll to the bottom whenever
  // a new message is sent or received, not only when the lastMessageInFocus changes.

  useEffect(() => {
    const updateChatId = async () => {
      await updateLastChatId(chatId);
    };
    updateChatId();
  }, [chatId]);

  return (
    <Card
      radius="none"
      className="h-[calc(100dvh-80px)] m-0 border-1 border-slate-300 dark:border-slate-700 bg-zig-zag"
    >
      <div className="sticky space-x-2">
        <CurrentChatPartner />
      </div>
      <div className="flex flex-col-reverse h-svh overflow-y-scroll scrollbar-hide scroll-smooth">
        {/* Pullable space */}
        <InfiniteScroll
          onPull={handlePull}
          allMessagesLoaded={allMessagesLoaded}
          distanceFromTop={147}
        >
          {allMessagesLoaded && (
            <div className="text-center text-xs pt-4">
              This is the start of the conversation
            </div>
          )}
          <ChatThread />
          {/* Ref to mark the end of the conversation */}
          <div ref={messageEndRef} />
        </InfiniteScroll>
        {/* Chat thread */}
      </div>
      <div className="sticky mb-3">
        {currentChat?.inactive && (
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-3 text-center text-sm">
            This chat is inactive. Your chat partner has deleted their account.
          </div>
        )}
        {!currentChat?.inactive && <ChatForm />}
      </div>
    </Card>
  );
}
