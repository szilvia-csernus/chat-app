import { getCurrentMember, getMembers } from '@/app/actions/memberActions';
import MembersList from './MembersList';
import { authWithRedirect } from '../actions/authActions';
import { notFound } from 'next/navigation';


export const dynamic = "force-dynamic";

export default async function MembersPage() {
  await authWithRedirect();

  const members = await getMembers();

  const currentMember = await getCurrentMember();
  if (!currentMember) return notFound();

  return (
    <div className="w-full h-full p-5 border-1 border-slate-300 dark:border-slate-500 bg-zig-zag">
      <MembersList members={members} currentMember={currentMember} />
    </div>
  );
}