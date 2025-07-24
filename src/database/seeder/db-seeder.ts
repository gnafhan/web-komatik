import 'dotenv/config';
import { seedProducts } from './product-seeder';

(async () => {
  try {
    await seedProducts();
    process.exit(0);
  } catch (err) {
    console.error('Database seeding failed:', err);
    process.exit(1);
  }
})();
