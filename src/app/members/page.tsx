import MembersList from './MembersList';
import { authWithRedirect } from '../actions/authActions';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import { getCurrentProfile } from '../actions/profileActions';
import { mapProfileDataToCurrentMember } from '@/lib/maps';


export const dynamic = "force-dynamic";

export default async function MembersPage() {
  await authWithRedirect();

  const currentProfile = await getCurrentProfile();
  const currentMember = currentProfile && mapProfileDataToCurrentMember(currentProfile);
  if (!currentMember) return redirect("/profile/complete-profile")

  return (
    <div className="w-full h-full min-h-[calc(100dvh-80px)] flex flex-col justify-strech">
      <MembersList currentMember={currentMember}  />
      <Footer />
    </div>
  );
}