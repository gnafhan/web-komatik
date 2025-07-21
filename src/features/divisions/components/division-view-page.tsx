import { Division } from '@/types';
import { notFound } from 'next/navigation';
import DivisionForm from './division-form';
import { db } from '@/database/connection/firebase.client';
import { doc, getDoc } from 'firebase/firestore';

export default async function DivisionViewPage({
  divisionId
}: {
  divisionId: string;
}) {
  let division: Division | null = null;
  let pageTitle = 'Create New Division';

  if (divisionId !== 'new') {
    const docRef = doc(db, 'divisions', divisionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data) {
        division = {
          ...data,
          id: docSnap.id,
          created_at: data.created_at?.toDate
            ? data.created_at.toDate().toISOString()
            : new Date().toISOString(),
          updated_at: data.updated_at?.toDate
            ? data.updated_at.toDate().toISOString()
            : new Date().toISOString()
        } as Division;
      }
    }

    if (!division) {
      notFound();
    }
    pageTitle = `Edit Division`;
  }

  return <DivisionForm initialData={division} pageTitle={pageTitle} />;
}
