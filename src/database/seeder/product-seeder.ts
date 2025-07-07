import { db } from '../connection/firebase.server';
import { faker } from '@faker-js/faker';
import { Product } from '@/constants/mock-api';

const categories = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Toys',
  'Groceries',
  'Books',
  'Jewelry',
  'Beauty Products'
];

export async function seedProducts() {
  const batch = db.batch();
  const productsCol = db.collection('products');

  for (let i = 1; i <= 20; i++) {
    const id = i;
    const productId = id.toString();
    const docRef = productsCol.doc(productId);
    // Check if product already exists
    const docSnap = await docRef.get();
    if (docSnap.exists) continue;
    // Use remote image URL as photo_url
    const photo_url = `https://api.slingacademy.com/public/sample-products/${productId}.png`;
    const product: Product = {
      id,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      created_at: faker.date
        .between({ from: '2022-01-01', to: '2023-12-31' })
        .toISOString(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      photo_url,
      category: faker.helpers.arrayElement(categories),
      updated_at: faker.date.recent().toISOString()
    };
    batch.set(docRef, product);
  }
  await batch.commit();
  console.log('Seeded 20 products to Firestore.');
}
