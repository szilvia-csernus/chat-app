// import { pusherClient } from "@/lib/pusher";
// import { MessageDto } from "@/types";
// import { usePathname, useSearchParams } from "next/navigation";
// import { Channel } from "pusher-js";
// import { useCallback, useEffect, useRef } from "react";
// import { useMessageStore } from "./useMessageStore";
// import {
//   newLikeToast,
//   newMessageToast,
//   NewMessageToastProps,
// } from "@/components/NewMessageToast";
// import { getUnreadMessageCount } from "@/app/actions/messageActions";
// import { channel } from "diagnostics_channel";

// export const useNotificationChannel = (userId: string | null) => {
//   const channelRef = useRef<Channel | null>(null);
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const add = useMessageStore((state) => state.add);
//   const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);

//   const handleNewMessage = useCallback(
//     (message: MessageDto) => {
//       if (
//         pathname === "/messages" &&
//         searchParams.get("container") !== "outbox"
//       ) {
//         add(message);
//       } else if (pathname !== `/members/${message.senderId}/chat`) {
//         newMessageToast({
//           senderId: message.senderId,
//           senderName: message.senderName,
//           senderImage: message.senderImage,
//         });
//       }
//       getUnreadMessageCount().then((count) => {
//         updateUnreadCount(count);
//       });
//     },
//     [add, pathname, searchParams, updateUnreadCount]
//   );

//   const handleLike = useCallback(
//     ({ senderId, senderName, senderImage }: NewMessageToastProps) => {
//       newLikeToast({ senderId, senderName, senderImage });
//     },
//     [newMessageToast]
//   );

//   useEffect(() => {
//     if (!userId) return;

//     getUnreadMessageCount().then((count) => {
//       updateUnreadCount(count);
//     });

//     if (!channelRef.current) {
//       channelRef.current = pusherClient.subscribe(`private-${userId}`);
//       channelRef.current.bind("new-message-notification", handleNewMessage);
//       channelRef.current.bind("new-like-notification", handleLike);
//     }

//     return () => {
//       if (channelRef.current && channelRef.current.subscribed) {
//         channelRef.current.unsubscribe();
//         channelRef.current.unbind("new-message-notification", handleNewMessage);
//         channelRef.current.unbind("new-like-notification", handleLike);
//         channelRef.current = null;
//       }
//     };
//   }, [userId, handleNewMessage, updateUnreadCount]);
// };
