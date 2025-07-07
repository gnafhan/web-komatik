import 'dotenv/config';
import { seedProducts } from './product-seeder';

(async () => {
  try {
    await seedProducts();
    console.log('Database seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Database seeding failed:', err);
    process.exit(1);
  }
})();
