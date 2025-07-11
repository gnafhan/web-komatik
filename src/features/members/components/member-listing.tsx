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
  let membersRef: FirebaseFirestore.Query = db.collection('members');

  if (search) {
    const s = search.toLowerCase();
    membersRef = membersRef
      .where('name', '>=', s)
      .where('name', '<=', s + '\uf8ff');
  }

  const snapshot = await membersRef.get();
  const totalMembers = snapshot.size;

  const paginatedQuery = membersRef
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset((page - 1) * limit);

  const paginatedSnapshot = await paginatedQuery.get();

  const members = paginatedSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate?.().toISOString() || null,
      updated_at: data.updated_at?.toDate?.().toISOString() || null
    } as Member;
  });

  return { members, totalMembers };
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
