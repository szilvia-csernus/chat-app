"use client";

import { Profile } from "@prisma/client";
import EditProfileDetails from "./EditProfileDetails";
import { Session } from "next-auth";

type ProfileDetailsProps = {
  session: Session | null;
  userName: string;
  profile: Profile | null;
};

export default function ProfileDetails({ session, userName, profile }: ProfileDetailsProps) {
  return (
    <div className="border p-5 rounded-lg border-[#999]">
      <div className="mb-2">
        <h1 className="text-2xl mb-4 font-semibold">Personal Details</h1>
        <p className="text-medium font-normal">Name: {userName}</p>
        <p className="text-medium font-normal">
          Country:{" "}
          {profile ? (
            profile.country
          ) : (
            <span className="text-warning">missing</span>
          )}
        </p>
        <p className="text-medium font-normal">
          Gender:{" "}
          {profile ? (
            profile.gender
          ) : (
            <span className="text-warning">missing</span>
          )}
        </p>
        <p className="text-medium font-normal">
          Date of Birth:{" "}
          {profile && profile.dateOfBirth ? (
            new Date(profile.dateOfBirth).toDateString()
          ) : (
            <span className="text-warning">missing</span>
          )}
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
