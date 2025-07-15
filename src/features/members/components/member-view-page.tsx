import { Member } from '@/types';
import { notFound } from 'next/navigation';
import MemberForm from './member-form';
import { db } from '@/database/connection/firebase.server';

type TMemberViewPageProps = {
  memberId: string;
};

export default async function MemberViewPage({
  memberId
}: TMemberViewPageProps) {
  let member: Member | null = null;
  let pageTitle = 'Create New Member';

  if (memberId !== 'new') {
    const docRef = db.collection('members').doc(memberId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      if (data) {
        member = {
          ...data,
          id: docSnap.id,
          created_at: data.created_at?.toDate
            ? data.created_at.toDate().toISOString()
            : new Date().toISOString(),
          updated_at: data.updated_at?.toDate
            ? data.updated_at.toDate().toISOString()
            : new Date().toISOString()
        } as Member;
      }
    }

    if (!member) {
      notFound();
    }
    pageTitle = `Edit Member`;
  }

  return <MemberForm initialData={member} pageTitle={pageTitle} />;
}
