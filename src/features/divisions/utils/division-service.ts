import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/database/connection/firebase.client';
import { Division } from '@/types';

const divisionsRef = collection(db, 'divisions');

export async function addDivision(data: Partial<Division>) {
  const now = serverTimestamp();
  const docRef = await addDoc(divisionsRef, {
    ...data,
    created_at: now,
    updated_at: now
  });
  return docRef.id;
}

export async function getDivisions(): Promise<Division[]> {
  const snapshot = await getDocs(divisionsRef);
  return snapshot.docs.map(
    (docSnap) =>
      ({
        ...docSnap.data(),
        id: docSnap.id
      }) as Division
  );
}

export async function updateDivision(docId: string, data: Partial<Division>) {
  const divisionDoc = doc(divisionsRef, docId);
  await updateDoc(divisionDoc, {
    ...data,
    updated_at: serverTimestamp()
  });
}

export async function deleteDivision(docId: string) {
  const divisionDoc = doc(divisionsRef, docId);
  await deleteDoc(divisionDoc);
}
