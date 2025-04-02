import { MessageData } from "@/types";
import { AppThunk } from "./store";
import { updateMsgGroup } from "./features/chatsSlice";
import { produce } from "immer";

export function insertMsgIdIntoGroup(
  chatId: string,
  date: string,
  message: MessageData
): AppThunk {
  return async (dispatch, getState) => {
    if (!message.senderId) return;

    const chat = getState().chats.chats[chatId];
    const originalMsgGroup = chat.msgGroupsData.msgGroups[date];
    // with Immer, we can modify the draft object directly
    // and it will produce a new object with the changes
    const updatedMsgGroup = produce(originalMsgGroup, (draft) => {
      const msgDate = message.createdAt;
      const clusters = draft.msgClusters;
      const clusterIdsChronList = draft.clusterIdsChronList;
      const messagesState = getState().messages;

      // I. when clusterIdsChronList is empty
      if (clusterIdsChronList.length === 0) {
        const newClusterId = message.id;
        clusters[newClusterId] = {
          id: newClusterId,
          senderId: message.senderId as string,
          msgIds: [message.id],
        };
        clusterIdsChronList.push(newClusterId);
        return;
      }

      // II. determine where the message fits in the clusterIdsChronList
      for (let i = 0; i < clusterIdsChronList.length; i++) {
        const cluster = clusters[clusterIdsChronList[i]];
        const clusterSernderId = cluster.senderId;

        const messageIds = clusters[clusterIdsChronList[i]].msgIds;
        const firstMsgId = messageIds[0];
        const firstMsgDate = new Date(
          messagesState.messages[firstMsgId].createdAt
        );
        const lastMsgId = messageIds[messageIds.length - 1];
        const lastMsgDate = new Date(
          messagesState.messages[lastMsgId].createdAt
        );

        // II/1. if the message is before the first message in the cluster
        if (msgDate <= firstMsgDate) {
          // if the message is not from the same sender
          if (clusterSernderId != message.senderId) {
            // create a new cluster and add the messageId to it
            const newClusterId = message.id;
            clusters[newClusterId] = {
              id: newClusterId,
              senderId: message.senderId as string,
              msgIds: [message.id],
            };
            clusterIdsChronList.splice(i, 0, newClusterId);
            return;
          } else {
            // if the message is from the same sender, add the id to
            // the beginning of the cluster
            clusters[clusterIdsChronList[i]].msgIds.unshift(message.id);
            return;
          }
        }
        // II/2. if the message is in the range of the cluster
        if (msgDate > firstMsgDate && msgDate <= lastMsgDate) {
          for (let j = 0; j < messageIds.length; j++) {
            const mId = messageIds[j];
            const mDate = new Date(messagesState.messages[mId].createdAt);
            // if msgDate is before (or the same time as) the current message date
            if (msgDate <= mDate) {
              // if the message is not from the same sender
              if (clusterSernderId != message.senderId) {
                // cut the current cluster in two by slicing the msgIds array and
                // creating a new cluster
                const secondClusterId = mId;
                clusters[secondClusterId] = {
                  id: secondClusterId,
                  senderId: clusterSernderId,
                  msgIds: clusters[clusterIdsChronList[i]].msgIds.slice(j),
                };
                // remove the new second cluster's messageIds from the first cluster
                clusters[clusterIdsChronList[i]].msgIds.splice(
                  j,
                  clusters[clusterIdsChronList[i]].msgIds.length - j
                );

                // create a new cluster and add the messageId to it
                const newClusterId = message.id;
                clusters[newClusterId] = {
                  id: newClusterId,
                  senderId: message.senderId as string,
                  msgIds: [message.id],
                };

                // add the new cluster and the second cluster to the list
                clusterIdsChronList.splice(i, 0, newClusterId);
                clusterIdsChronList.splice(i + 1, 0, secondClusterId);
                return;
              } else {
                // if the message is from the same sender, insert the id
                // in the right position in the cluster
                clusters[clusterIdsChronList[i]].msgIds.splice(
                  j,
                  0,
                  message.id
                );
                return;
              }
            }
          }

          return;
        }

        // II/3. if the message is after the last message in the cluster
        if (msgDate > lastMsgDate) {
          // if this was the last cluster
          if (i == clusterIdsChronList.length - 1) {
            // if the message is not from the same sender
            if (clusterSernderId != message.senderId) {
              // create a new cluster and add the messageId to it
              const newClusterId = message.id;
              clusters[newClusterId] = {
                id: newClusterId,
                senderId: message.senderId as string,
                msgIds: [message.id],
              };
              clusterIdsChronList.push(newClusterId);

              return;
            } else {
              // if the message is from the same sender, add the id to
              // the end of the cluster
              clusters[clusterIdsChronList[i]].msgIds.push(message.id);

              return;
            }
          }
          // if msg sender is same as this cluster
          if (clusterSernderId == message.senderId) {
            const nextClusterId = clusterIdsChronList[i + 1];
            const nextClusterFirstMsgDate = new Date(
              messagesState.messages[
                clusters[nextClusterId].msgIds[0]
              ].createdAt
            );
            // ... and is earlier than the next Cluster
            if (msgDate < nextClusterFirstMsgDate) {
              // append the msgId to the current cluster
              clusters[clusterIdsChronList[i]].msgIds.push(message.id);

              return;
            }
          }
        }
      }
    });

    // Dispatch the finalised object
    dispatch(
      updateMsgGroup({
        chatId,
        date,
        msgGroup: updatedMsgGroup,
      })
    );
  };
}
