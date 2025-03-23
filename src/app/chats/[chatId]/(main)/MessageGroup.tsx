"use client";

import { timeAgoDate } from "@/lib/utils";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentChatMsgClustersDataByDate } from "@/redux-store/features/chatsSlice";
import MessageCluster from "./MessageCluster";
import MessagesDate from "./MessagesDate";

type Props = {
  date: string;
};

export default function MessageGroup({ date }: Props) {
  const messageClustersData = useAppSelector((state) =>
    selectCurrentChatMsgClustersDataByDate(state.chats, date)
  );

  const msgClusterIds = messageClustersData?.clusterIds || [];

  return (
    <>
      {date && (
        <div className="flex justify-center mt-6 mb-4">
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
    </>
  );
}
