import { getMembers } from '@/app/actions/memberActions';
import MembersList from './MembersList';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const session = await auth();

  if (!session) {
    return redirect('/login');
  }

  const membersData = await getMembers();
  const members = membersData ? membersData.map(member => ({
    id: member.id,
    name: member.user.name || '',
    image: member.user.image || '',
  })) : null;

  

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 text-primary">
      <MembersList members={members} />
    </div>
  );
}
