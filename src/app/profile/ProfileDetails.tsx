"use client";

import { Profile } from "@prisma/client";
import EditProfileDetails from "./EditProfileDetails";
import { Session } from "next-auth";

type ProfileDetailsProps = {
  session: Session | null;
  userName: string;
  profile: Profile | null;
};

export default function ProfileDetails({
  session,
  userName,
  profile,
}: ProfileDetailsProps) {
  return (
    <div className="flex flex-col justify-between items-center gap-4 text-md">
      <div className="sm:hidden">*</div>
      <h1 className="text-xl font-bold">Personal Details</h1>
      <div className="flex flex-col gap-1 ml-3">
        <p className="font-bold">
          Name: <span className="font-normal">{userName}</span>
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

      <EditProfileDetails
        session={session}
        userName={userName}
        profile={profile}
      />
    </div>
  );
}
