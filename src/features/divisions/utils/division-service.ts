import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Division } from './division-schema';
import { db } from '@/database/connection/firebase.client';

const divisionsRef = collection(db, 'divisions');

export async function addDivision(data: Partial<Division>) {
  const now = serverTimestamp();
  const docRef = await addDoc(divisionsRef, {
    ...data,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
}

export async function getDivisions(): Promise<Division[]> {
  const snapshot = await getDocs(divisionsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.data().id,
    name: doc.data().name,
    slug: doc.data().slug,
    description: doc.data().description,
    order_index: doc.data().order_index,
    createdAt: doc.data().createdAt as Timestamp,
    updatedAt: doc.data().updatedAt as Timestamp,
    _docId: doc.id
  }));
}

export async function updateDivision(_docId: string, data: Partial<Division>) {
  const divisionDoc = doc(divisionsRef, _docId);
  await updateDoc(divisionDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteDivision(_docId: string) {
  const divisionDoc = doc(divisionsRef, _docId);
  await deleteDoc(divisionDoc);
}
