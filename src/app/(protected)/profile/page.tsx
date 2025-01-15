import { getUserById } from '@/app/actions/authActions';
import { getProfileByUserId } from '@/app/actions/profileActions';
import { getPhotoByUserId } from '@/app/actions/photoActions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import ProfileImage from './ProfileImage';
import ProfileDetails from './ProfileDetails';


export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const user = await getUserById(session?.user.id as string);
  if (user && !user.profileComplete) {
    redirect("/complete-profile");
  }
  
  const userName = user?.name ?? "";
  const profile = await getProfileByUserId(session?.user.id as string);
  const photo = await getPhotoByUserId(session?.user.id as string);
  const photoUrl = photo ? photo.imageUrl : null;

  return (
    <div>
      <div className="font-semibold text-2xl">
        <ProfileImage session={session} photoUrl={photoUrl} />
      </div>
      <br />
      <div className="font-semibold text-2xl">
        <ProfileDetails session={session} userName={userName} profile={profile} />
      </div>
      <br />

      <h3 className="text-xl font-semicolon">User session data: </h3>
      {session ? (
        <div>
          <pre>{JSON.stringify(session, null, 2)}</pre>

          <br />
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
        </div>
      )}
    </div>
  );
}
