'use server';

import { db, storage } from '@/database/connection/firebase.server';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters.'),
  student_id: z.string().min(5, 'Student ID must be at least 5 characters.'),
  bio: z.string().min(10, 'Bio must be at least 10 characters.')
});

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    '.jpg, .jpeg, .png and .webp files are accepted.'
  );

async function uploadFile(file: File): Promise<string> {
  const bucket = storage.bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `members/${Date.now()}_${file.name}`;
  const bucketFile = bucket.file(fileName);

  await bucketFile.save(buffer, {
    metadata: { contentType: file.type },
    public: true
  });

  return bucketFile.publicUrl();
}

export async function addMember(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = formSchema.safeParse(rawData);
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const file = formData.get('photo_url') as File;
    const validatedFile = fileSchema.safeParse(file);
    if (!validatedFile.success) {
      return {
        success: false,
        message: 'Invalid file.',
        errors: { photo_url: validatedFile.error.flatten().fieldErrors }
      };
    }

    const photoUrl = await uploadFile(file);

    const newMemberRef = db.collection('members').doc();
    await newMemberRef.set({
      ...validatedFields.data,
      id: newMemberRef.id,
      photo_url: photoUrl,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    });

    revalidatePath('/dashboard/members');
    return { success: true, message: 'Member added successfully.' };
  } catch (error) {
    console.error('Error adding member:', error);
    return {
      success: false,
      message: 'Failed to add member. Please try again.'
    };
  }
}

export async function updateMember(id: string, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = formSchema.safeParse(rawData);
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const memberRef = db.collection('members').doc(id);
    const memberDoc = await memberRef.get();
    if (!memberDoc.exists) {
      return { success: false, message: 'Member not found.' };
    }

    let photoUrl = memberDoc.data()?.photo_url;
    const file = formData.get('photo_url');

    if (file instanceof File && file.size > 0) {
      const validatedFile = fileSchema.safeParse(file);
      if (!validatedFile.success) {
        return {
          success: false,
          message: 'Invalid file.',
          errors: { photo_url: validatedFile.error.flatten().fieldErrors }
        };
      }
      photoUrl = await uploadFile(file);
    }

    await memberRef.update({
      ...validatedFields.data,
      photo_url: photoUrl,
      updated_at: FieldValue.serverTimestamp()
    });

    revalidatePath('/dashboard/members');
    revalidatePath(`/dashboard/members/${id}`);
    return { success: true, message: 'Member updated successfully.' };
  } catch (error) {
    console.error('Error updating member:', error);
    return {
      success: false,
      message: 'Failed to update member. Please try again.'
    };
  }
}

export async function deleteMember(id: string) {
  try {
    const memberRef = db.collection('members').doc(id);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists) {
      return { success: false, message: 'Member not found.' };
    }

    const photoUrl = memberDoc.data()?.photo_url;
    if (photoUrl) {
      const bucket = storage.bucket(
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      );
      try {
        const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        if (!bucketName) {
          throw new Error('Firebase storage bucket name is not configured.');
        }
        const prefix = `https://storage.googleapis.com/${bucketName}/`;
        if (photoUrl.startsWith(prefix)) {
          const filePath = photoUrl.substring(prefix.length);
          const decodedFilePath = decodeURIComponent(filePath);
          await bucket.file(decodedFilePath).delete();
        } else {
          console.warn(
            'Photo URL does not match expected format, skipping deletion.'
          );
        }
      } catch (error) {
        console.error(
          'Failed to delete image, but proceeding with doc deletion:',
          error
        );
      }
    }

    await memberRef.delete();

    revalidatePath('/dashboard/members');
    return { success: true, message: 'Member deleted successfully.' };
  } catch (error) {
    console.error('Error deleting member:', error);
    return {
      success: false,
      message: 'Failed to delete member. Please try again.'
    };
  }
}
