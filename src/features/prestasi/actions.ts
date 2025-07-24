'use server';

import { randomUUID } from 'crypto';
import { db, storage } from '@/database/connection/firebase.server';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { fileSchema, prestasiSchema } from './schema';

function handleError(error: unknown, context: string) {
  const errorId = randomUUID();
  return {
    success: false,
    message: `An unexpected error occurred. Please try again. (Error ID: ${errorId})`
  };
}

async function uploadFile(
  file: File
): Promise<{ publicUrl: string; fileName: string }> {
  const bucket = storage.bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueId = randomUUID();
  const fileName = `prestasi/${uniqueId}_${file.name}`;
  const bucketFile = bucket.file(fileName);

  await bucketFile.save(buffer, {
    metadata: { contentType: file.type },
    public: true
  });

  return {
    publicUrl: bucketFile.publicUrl(),
    fileName: fileName
  };
}

export async function addPrestasi(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const members = formData.getAll('members').map(String); // Always string[]
    const validatedFields = prestasiSchema.safeParse({ ...rawData, members });
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const file = formData.get('image_url') as File;
    let imageUrl = '';
    let fileName = '';
    if (file && fileSchema.safeParse(file).success) {
      const upload = await uploadFile(file);
      imageUrl = upload.publicUrl;
      fileName = upload.fileName;
    }

    const newPrestasiRef = db.collection('prestasi').doc();
    await newPrestasiRef.set({
      ...validatedFields.data,
      id: newPrestasiRef.id,
      image_url: imageUrl,
      image_filename: fileName,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    });

    revalidatePath('/dashboard/prestasi');
    return { success: true, message: 'Prestasi added successfully.' };
  } catch (error) {
    return handleError(error, 'addPrestasi');
  }
}

export async function updatePrestasi(id: string, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const members = formData.getAll('members').map(String); // Always string[]
    const validatedFields = prestasiSchema.safeParse({ ...rawData, members });
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const prestasiRef = db.collection('prestasi').doc(id);
    const prestasiDoc = await prestasiRef.get();
    if (!prestasiDoc.exists) {
      return { success: false, message: 'Prestasi not found.' };
    }

    const prestasiData = prestasiDoc.data();
    let imageUrl = prestasiData?.image_url;
    let fileName = prestasiData?.image_filename;
    const file = formData.get('image_url') as File;
    if (file && fileSchema.safeParse(file).success) {
      const upload = await uploadFile(file);
      imageUrl = upload.publicUrl;
      fileName = upload.fileName;
    }

    await prestasiRef.update({
      ...validatedFields.data,
      image_url: imageUrl,
      image_filename: fileName,
      updated_at: FieldValue.serverTimestamp()
    });

    revalidatePath('/dashboard/prestasi');
    return { success: true, message: 'Prestasi updated successfully.' };
  } catch (error) {
    return handleError(error, 'updatePrestasi');
  }
}

export async function deletePrestasi(id: string) {
  try {
    const prestasiRef = db.collection('prestasi').doc(id);
    await prestasiRef.delete();
    revalidatePath('/dashboard/prestasi');
    return { success: true, message: 'Prestasi deleted successfully.' };
  } catch (error) {
    return handleError(error, 'deletePrestasi');
  }
}

export async function fetchPrestasi(id: string) {
  try {
    const docRef = db.collection('prestasi').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    const data = docSnap.data();
    if (!data) return null;
    return {
      ...data,
      id: docSnap.id,
      members: Array.isArray(data.members)
        ? data.members.map((m) => (typeof m === 'string' ? m : m.id))
        : [],
      created_at: data.created_at?.toDate?.()
        ? data.created_at.toDate().toISOString()
        : null,
      updated_at: data.updated_at?.toDate?.()
        ? data.updated_at.toDate().toISOString()
        : null
    };
  } catch (error) {
    return null;
  }
}

export async function fetchPrestasiList() {
  try {
    const snapshot = await db
      .collection('prestasi')
      .orderBy('created_at', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
}

export async function addCategory(category: string) {
  const ref = db.collection('prestasi_categories').doc();
  await ref.set({ value: category });
}

export async function addAward(award: string) {
  const ref = db.collection('prestasi_awards').doc();
  await ref.set({ value: award });
}

export async function fetchCategories(): Promise<string[]> {
  const snapshot = await db.collection('prestasi_categories').get();
  return snapshot.docs.map((doc) => doc.data().value);
}

export async function fetchAwards(): Promise<string[]> {
  const snapshot = await db.collection('prestasi_awards').get();
  return snapshot.docs.map((doc) => doc.data().value);
}
