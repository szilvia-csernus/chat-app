import { getCurrentMember, getMembers } from '@/app/actions/memberActions';
import MembersList from './MembersList';
import { authWithRedirect } from '../actions/authActions';
import { notFound } from 'next/navigation';


export const dynamic = "force-dynamic";


export default async function MembersPage() {
  await authWithRedirect();

  const membersData = await getMembers();
  const members = membersData ? membersData.map(member => ({
    id: member.id,
    name: member.user.name || '',
    image: member.user.image || '',
  })) : null;

  const currentMember = await getCurrentMember();

  if (!currentMember) return notFound();

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 text-primary">
      <MembersList members={members} currentMember={currentMember}/>
    </div>
  );
}
