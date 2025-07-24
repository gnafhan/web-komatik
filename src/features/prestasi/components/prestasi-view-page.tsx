import { Prestasi, Member } from '@/types';
import { notFound } from 'next/navigation';
import PrestasiForm from './prestasi-form';
import { fetchPrestasi } from '../actions';
import { db } from '@/database/connection/firebase.server';

async function fetchAllMembers(): Promise<Member[]> {
  const membersRef = db.collection('members');
  const snapshot = await membersRef.orderBy('created_at', 'desc').get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate?.().toISOString() || null,
      updated_at: data.updated_at?.toDate?.().toISOString() || null
    } as Member;
  });
}

export default async function PrestasiViewPage({
  prestasiId
}: {
  prestasiId: string;
}) {
  let prestasi: Prestasi | null = null;
  let pageTitle = 'Create New Prestasi';

  let members = await fetchAllMembers();

  if (prestasiId !== 'new') {
    const data = await fetchPrestasi(prestasiId);
    if (data) {
      prestasi = data as Prestasi;
      pageTitle = 'Edit Prestasi';
      // Ensure all member IDs in prestasi.members are present in members
      const memberIds: string[] = Array.isArray(prestasi.members)
        ? prestasi.members.map((id: any) => String(id))
        : [];
      const missingMemberIds: string[] = memberIds.filter(
        (id) => !members.some((m) => m.id === id)
      );
      if (missingMemberIds.length > 0) {
        const missingMembers: Member[] = (
          await Promise.all(
            missingMemberIds.map(async (id) => {
              const doc = await db.collection('members').doc(id).get();
              if (!doc.exists) return null;
              const data = doc.data();
              if (!data) return null;
              return {
                ...data,
                id: doc.id,
                created_at: data.created_at?.toDate?.().toISOString() || null,
                updated_at: data.updated_at?.toDate?.().toISOString() || null
              } as Member;
            })
          )
        ).filter(Boolean) as Member[];
        members = [...members, ...missingMembers];
      }
      // Debug logging
    } else {
      notFound();
    }
  }

  return (
    <PrestasiForm
      initialData={prestasi}
      pageTitle={pageTitle}
      members={members}
    />
  );
}
