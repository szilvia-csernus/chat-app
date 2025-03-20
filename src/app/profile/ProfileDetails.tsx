"use client";

import { Profile } from "@prisma/client";
import EditProfileDetails from "./EditProfileDetails";
import { useAppDispatch } from "@/redux-store/hooks";
import { useEffect } from "react";
import { setChatVisible } from "@/redux-store/features/uiSlice";

type ProfileDetailsProps = {
  userName: string;
  profile: Profile | null;
};

export default function ProfileDetails({
  userName,
  profile,
}: ProfileDetailsProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setChatVisible(false));
  }, [dispatch]);

  return (
    <div className="flex flex-col justify-between items-center gap-4 text-md">
      <div className="sm:hidden">*</div>
      <h1 className="text-xl font-bold">Personal Details</h1>
      <div className="flex flex-col gap-1 ml-3">
        <p className="font-bold">
          First Name: <span className="font-normal">{userName}</span>
        </p>
        <p className="font-bold">
          Country:{" "}
          <span className="font-normal">
            {profile ? (
              profile.country
            ) : (
              <span className="text-warning">missing</span>
            )}
          </span>
        </p>
        <p className="font-bold">
          Gender:{" "}
          <span className="font-normal">
            {profile ? (
              profile.gender
            ) : (
              <span className="text-warning">missing</span>
            )}
          </span>
        </p>
        <p className="font-bold">
          Date of Birth:{" "}
          <span className="font-normal">
            {profile && profile.dateOfBirth ? (
              new Date(profile.dateOfBirth).toDateString()
            ) : (
              <span className="text-warning">missing</span>
            )}
          </span>
        </p>
      </div>

      <EditProfileDetails userName={userName} profile={profile} />
    </div>
  );
}
