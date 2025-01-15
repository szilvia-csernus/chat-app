import { getMembers } from '@/app/actions/memberActions';
import MembersList from './MembersList';

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 text-primary">
      <MembersList members={members} />
    </div>
  );
}
