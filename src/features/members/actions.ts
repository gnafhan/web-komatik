'use server';

import { randomUUID } from 'crypto';
import { db, storage } from '@/database/connection/firebase.server';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { fileSchema, memberSchema } from './schema';

function handleError(error: unknown, context: string) {
  const errorId = randomUUID();
  console.error(`Error in ${context} (ID: ${errorId}):`, error);
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
  const fileName = `members/${uniqueId}_${file.name}`;
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

export async function addMember(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = memberSchema.safeParse(rawData);
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

    const { publicUrl, fileName } = await uploadFile(file);

    const newMemberRef = db.collection('members').doc();
    await newMemberRef.set({
      ...validatedFields.data,
      id: newMemberRef.id,
      photo_url: publicUrl,
      photo_filename: fileName,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    });

    revalidatePath('/dashboard/members');
    return { success: true, message: 'Member added successfully.' };
  } catch (error) {
    return handleError(error, 'addMember');
  }
}

export async function updateMember(id: string, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = memberSchema.safeParse(rawData);
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

    const memberData = memberDoc.data();
    let photoUrl = memberData?.photo_url;
    let photoFilename = memberData?.photo_filename;

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

      if (photoFilename) {
        const bucket = storage.bucket(
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        );
        try {
          await bucket.file(photoFilename).delete();
        } catch (deleteError) {
          console.error(
            'Failed to delete old image during update:',
            deleteError
          );
        }
      }

      const { publicUrl, fileName } = await uploadFile(file);
      photoUrl = publicUrl;
      photoFilename = fileName;
    }

    await memberRef.update({
      ...validatedFields.data,
      photo_url: photoUrl,
      photo_filename: photoFilename,
      updated_at: FieldValue.serverTimestamp()
    });

    revalidatePath('/dashboard/members');
    revalidatePath(`/dashboard/members/${id}`);
    return { success: true, message: 'Member updated successfully.' };
  } catch (error) {
    return handleError(error, `updateMember with id: ${id}`);
  }
}

export async function deleteMember(id: string) {
  try {
    const memberRef = db.collection('members').doc(id);
    const memberDoc = await memberRef.get();

    if (!memberDoc.exists) {
      return { success: false, message: 'Member not found.' };
    }

    const memberData = memberDoc.data();
    const photoFilename = memberData?.photo_filename;

    if (photoFilename) {
      const bucket = storage.bucket(
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      );
      try {
        await bucket.file(photoFilename).delete();
      } catch (error) {
        console.error(
          `Failed to delete image '${photoFilename}' for member '${id}', but proceeding with doc deletion:`,
          error
        );
      }
    }

    await memberRef.delete();

    revalidatePath('/dashboard/members');
    return { success: true, message: 'Member deleted successfully.' };
  } catch (error) {
    return handleError(error, `deleteMember with id: ${id}`);
  }
}
