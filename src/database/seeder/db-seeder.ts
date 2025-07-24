import 'dotenv/config';
import { seedProducts } from './product-seeder';

(async () => {
  try {
    await seedProducts();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
})();
