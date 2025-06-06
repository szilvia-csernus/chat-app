import { getCurrentUser } from "@/app/actions/authActions";
import { getCurrentProfile } from "@/app/actions/profileActions";
import { getPhotoByUserId } from "@/app/actions/photoActions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import ProfileImage from "./ProfileImage";
import ProfileDetails from "./ProfileDetails";
import DeleteProfile from "./DeleteProfile";


export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const user = await getCurrentUser();
  if (user && !user.profileComplete) {
    redirect("/profile/complete-profile");
  }

  const userName = user?.name ?? "User";
  const profile = await getCurrentProfile();

  const photo = await getPhotoByUserId(session?.user.id as string);
  const photoUrl = photo ? photo.imageUrl : "/images/user.png";

  return (
    <div className="w-full h-full p-10 bg-inherit text-slate-600 dark:text-slate-300 bg-zig-zag grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
      <ProfileImage photoUrl={photoUrl} userName={userName} />

      <ProfileDetails userName={userName} profile={profile} email={user?.email} />

      {/* <h3 className="text-lg font-semibold">User session data: </h3>
      <div className="text-xs mt-2">
        <pre>{JSON.stringify(session, null, 2)}</pre>

        <br />
      </div> */}

      <DeleteProfile />
    </div>
  );
}
