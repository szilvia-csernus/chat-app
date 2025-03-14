"use client";

import { timeAgoDate } from "@/lib/utils";
import { useAppSelector } from "@/redux-store/hooks";
import { selectCurrentChatMsgClustersDataByDate } from "@/redux-store/features/chatsSlice";
import MessageCluster from "./MessageCluster";

type Props = {
  date: string;
};

export default function MessageGroup({ date }: Props) {
  const messageClustersData = useAppSelector((state) =>
    selectCurrentChatMsgClustersDataByDate(state, date)
  );

  const msgClusterIds = messageClustersData?.clusterIds || [];

  return (
    <>
      {date && (
        <div
          suppressHydrationWarning={true}
          className=" w-none min-w-32 max-w-48 text-center text-xs font-semibold mt-6 mb-4 mx-auto py-1 px-2 border-1  text-secondary dark:text-teal-300 rounded-full border-slate-300 dark:border-slate-500"
        >
          {timeAgoDate(date)}
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
