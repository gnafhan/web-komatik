'use server';

import { db } from '@/database/connection/firebase.server';
import { Product } from '@/constants/mock-api';
import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

const formSchema = z.object({
  image: z.any(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  description: z.string()
});

export async function createProduct(values: z.infer<typeof formSchema>) {
  // Validate input
  const parsed = formSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error('Invalid product data');
  }
  // Generate a new ID (auto-increment or Firestore auto-ID)
  const docRef = db.collection('products').doc();
  const now = new Date();
  const product: Product = {
    id: Date.now(), // or use docRef.id if string is acceptable
    name: values.name,
    description: values.description,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    price: values.price,
    photo_url: '', // TODO: handle image upload
    category: values.category
  };
  await docRef.set(product);
  return { id: docRef.id };
}
