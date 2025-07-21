import { db } from '@/database/connection/firebase.client';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { Period } from '@/types';

export async function getPeriodById(id: number): Promise<Period | null> {
  const q = query(collection(db, 'periods'), where('id', '==', id));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const data = snapshot.docs[0].data();
  return {
    ...data,
    id: data.id,
    start_date: data.start_date?.toDate
      ? data.start_date.toDate()
      : data.start_date,
    end_date: data.end_date?.toDate ? data.end_date.toDate() : data.end_date,
    created_at: data.created_at?.toDate
      ? data.created_at.toDate().toISOString()
      : data.created_at,
    updated_at: data.updated_at?.toDate
      ? data.updated_at.toDate().toISOString()
      : data.updated_at
  } as Period;
}

export async function updatePeriodByFieldId(id: number, periodData: Period) {
  let created_at = periodData.created_at;
  if (typeof periodData.created_at === 'string') {
    created_at = Timestamp.fromDate(new Date(periodData.created_at));
  }
  const periodInsert = {
    ...periodData,
    created_at: created_at
  };
  const q = query(collection(db, 'periods'), where('id', '==', id));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error('Document not found');
  }

  const docRef = snapshot.docs[0].ref;
  await updateDoc(docRef, periodInsert);
}

export async function deletePeriod(id: number) {
  const q = query(collection(db, 'periods'), where('id', '==', id));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error('Document not found');
  }
  const docRef = snapshot.docs[0].ref;
  await deleteDoc(docRef);
}
