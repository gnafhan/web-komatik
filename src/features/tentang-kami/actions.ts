'use server';

import { randomUUID } from 'crypto';
import { db } from '@/database/connection/firebase.server';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { tentangKamiSchema } from './schema';

function handleError(error: unknown, context: string) {
  const errorId = randomUUID();
  console.error(`Error in ${context} (ID: ${errorId}):`, error);
  return {
    success: false,
    message: `An unexpected error occurred. Please try again. (Error ID: ${errorId})`
  };
}

export async function getTentangKami() {
  try {
    const docRef = db.collection('tentang-kami').doc('main');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return {
        success: true,
        data: {
          hero_title: 'Tentang Kami',
          hero_description:
            'KOMATIK UGM hadir untuk membina, memfasilitasi, dan mendorong mahasiswa UGM berprestasi di bidang TIK.',
          about_title: 'Apa itu KOMATIK?',
          about_description:
            'Komunitas Mahasiswa Teknologi Informasi dan Komunikasi UGM (KOMATIK UGM) adalah komunitas yang berperan sebagai wadah dari mahasiswa UGM dalam pengembangan diri di bidang TIK serta mendukung dan memfasilitasi mahasiswa UGM dalam ketertarikan mengikuti lomba IT. KOMATIK UGM merupakan komunitas lomba yang berada di bawah naungan Subdirektorat Kreativitas Mahasiswa UGM. KOMATIK UGM berdiri sejak tahun 2015 dan disahkan pada 8 Maret 2018.',
          objectives_title: 'Tujuan KOMATIK',
          objectives_description:
            'KOMATIK UGM memiliki beberapa tujuan yang menjadi dasar dari seluruh aktivitas dan program yang dijalankan, antara lain:',
          objectives: [
            'Menjadi wadah berkumpul mahasiswa yang minat terhadap Teknologi Informasi dan Komunikasi',
            'Mengembangkan kreativitas dan kemampuan mahasiswa dalam bidang Teknologi Informasi dan Komunikasi',
            'Memotivasi mahasiswa untuk berperan dalam mengembangkan dunia Teknologi Informasi dan Komunikasi',
            'Memberikan kontribusi terhadap UGM dalam bentuk riset dan pencapaian'
          ],
          video_title: 'Video Profile',
          video_url: 'https://www.youtube.com/embed/lelkP0nqxzc'
        }
      };
    }

    const data = docSnap.data();

    if (
      data &&
      !data.objectives &&
      (data.objective_1 ||
        data.objective_2 ||
        data.objective_3 ||
        data.objective_4)
    ) {
      const objectives = [];
      if (data.objective_1) objectives.push(data.objective_1);
      if (data.objective_2) objectives.push(data.objective_2);
      if (data.objective_3) objectives.push(data.objective_3);
      if (data.objective_4) objectives.push(data.objective_4);

      const {
        objective_1,
        objective_2,
        objective_3,
        objective_4,
        ...cleanData
      } = data;
      data.objectives = objectives;
      Object.assign(data, cleanData);
    }

    const serializedData = {
      ...data,
      created_at: data?.created_at?.toDate?.()?.toISOString() || null,
      updated_at: data?.updated_at?.toDate?.()?.toISOString() || null
    };

    return {
      success: true,
      data: serializedData
    };
  } catch (error) {
    return handleError(error, 'getTentangKami');
  }
}

export async function updateTentangKami(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());

    const objectives: string[] = [];
    const processedData: any = {};

    for (const [key, value] of Object.entries(rawData)) {
      if (key.startsWith('objectives[') && key.endsWith(']')) {
        objectives.push(value as string);
      } else {
        processedData[key] = value;
      }
    }

    processedData.objectives = objectives;

    const validatedFields = tentangKamiSchema.safeParse(processedData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors
      };
    }

    const docRef = db.collection('tentang-kami').doc('main');
    const docSnap = await docRef.get();

    const updateData = {
      ...validatedFields.data,
      updated_at: FieldValue.serverTimestamp()
    };

    if (!docSnap.exists) {
      await docRef.set({
        ...updateData,
        id: 'main',
        created_at: FieldValue.serverTimestamp()
      });
    } else {
      await docRef.update(updateData);
    }

    revalidatePath('/dashboard/tentang-kami');
    revalidatePath('/');

    return {
      success: true,
      message: 'Tentang Kami content updated successfully.'
    };
  } catch (error) {
    return handleError(error, 'updateTentangKami');
  }
}
