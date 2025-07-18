import { Member } from '@/types';
import { db } from '@/database/connection/firebase.server';
import MemberClient from './member-client';

async function fetchMembers({
  page = 1,
  limit = 10,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const membersRef = db.collection('members');
  const snapshot = await membersRef.orderBy('created_at', 'desc').get();

  let members = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate?.().toISOString() || null,
      updated_at: data.updated_at?.toDate?.().toISOString() || null
    } as Member;
  });

  if (search) {
    const s = search.toLowerCase();
    members = members.filter(
      (member) =>
        member.name.toLowerCase().includes(s) ||
        member.email.toLowerCase().includes(s) ||
        member.phone.toLowerCase().includes(s) ||
        member.student_id.toLowerCase().includes(s)
    );
  }

  const totalMembers = members.length;
  const paginatedMembers = members.slice((page - 1) * limit, page * limit);

  return { members: paginatedMembers, totalMembers };
}

type MemberListingPageProps = {
  page?: string | string[];
  name?: string | string[];
  perPage?: string | string[];
};

export default async function MemberListingPage({
  page: pageParam,
  name: nameParam,
  perPage: perPageParam
}: MemberListingPageProps) {
  const page = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1;
  const search = Array.isArray(nameParam) ? nameParam[0] : nameParam;
  const pageLimit =
    Number(Array.isArray(perPageParam) ? perPageParam[0] : perPageParam) || 10;

  const { members, totalMembers } = await fetchMembers({
    page,
    limit: pageLimit,
    search
  });

  return <MemberClient members={members} totalMembers={totalMembers} />;
}
