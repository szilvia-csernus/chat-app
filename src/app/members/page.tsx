import { getCurrentMember, getMembers } from '@/app/actions/memberActions';
import MembersList from './MembersList';
import { authWithRedirect } from '../actions/authActions';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';


export const dynamic = "force-dynamic";

export default async function MembersPage() {
  await authWithRedirect();

  const members = await getMembers();

  const currentMember = await getCurrentMember();
  if (!currentMember) return notFound();

  return (
    <div className="w-full h-full min-h-[calc(100dvh-80px)] flex flex-col justify-strech">
      <MembersList members={members} currentMember={currentMember} />
      <Footer />
    </div>
  );
}