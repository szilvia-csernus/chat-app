"use client";

import { useAppSelector } from "@/redux-store/hooks";
import { selectAllOldMsgsLoadedForCurrentChat, selectCurrentChatMsgClustersDataByDate } from "@/redux-store/features/chatsSlice";
import MessageCluster from "./MessageCluster";
import MessagesDate from "./MessagesDate";

type Props = {
  date: string;
  first: boolean;
};

export default function MessageGroup({ date, first }: Props) {
  const messageClustersData = useAppSelector((state) =>
    selectCurrentChatMsgClustersDataByDate(state.chats, date)
  );

  const msgClusterIds = messageClustersData?.clusterIdsChronList || [];
  const allMsgsLoadedForCurrentChat = useAppSelector(selectAllOldMsgsLoadedForCurrentChat);

  return (
    <div className="mb-4">
      {/* render the date if it's not the first one or, if all messages 
      have been loaded render the first one too */}
      {date && (!first || allMsgsLoadedForCurrentChat) && (
        <div className="flex justify-center mt-2 mb-4">
          <div
            className="py-1 px-12 h-[26px] text-xs font-semibold border-1 text-secondary dark:text-teal-300 rounded-full border-slate-300 dark:border-slate-500 bg-white/5"
          >
            <MessagesDate dateString={date} />
          </div>
        </div>
      )}
      {/* message clusters for specific date */}
      <ul>
        {msgClusterIds.map((id) => (
          <li key={id}>
            <MessageCluster clusterId={id} date={date} />
          </li>
        ))}
      </ul>
    </div>
  );
}
