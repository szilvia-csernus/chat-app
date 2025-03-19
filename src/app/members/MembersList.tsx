"use client";

import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import MemberCard from "./MemberCard";
import { selectExistingMemberIds } from "@/redux-store/features/membersSlice";
import { useEffect } from "react";
import { fetchCurrentMember } from "@/redux-store/thunks";


export default function MembersList() {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchCurrentMember());
  }, [dispatch]);


  const existingMemberIds = useAppSelector(selectExistingMemberIds);

  return (
    <div className="flex-grow h-full md:my-2 overflow-scroll scrollbar-hide scroll-smooth p-5 border-1 border-slate-300 dark:border-slate-800 bg-zig-zag text-slate-600 dark:text-slate-300">
      <div className="grid grid-cols-2 min-[500px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8 ">
        {existingMemberIds.length > 0 &&
          existingMemberIds.map((id) => {
            return <MemberCard key={id} memberId={id} />;
          })}
      </div>
      {existingMemberIds && existingMemberIds.length === 0 && (
        <div>
          <h1 className="text-xl font-semibold mt-5 justify-self-center">
            No members to show.
          </h1>
        </div>
      )}
    </div>
  );
}
