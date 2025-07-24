import { Product } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { db } from '@/database/connection/firebase.client';
import { collection, getDocs, query } from 'firebase/firestore';

// Helper to fetch products from Firestore
async function fetchProducts({
  page = 1,
  limit = 10,
  search,
  categories
}: {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string;
}) {
  let q = query(collection(db, 'products'));
  // Filtering and search logic can be extended here
  // For now, just fetch all and paginate client-side
  const snapshot = await getDocs(q);
  let products: Product[] = snapshot.docs.map((doc) => doc.data() as Product);
  if (categories) {
    const cats = categories.split('.');
    products = products.filter((p) => cats.includes(p.category));
  }
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s)
    );
  }
  const totalProducts = products.length;
  const offset = (page - 1) * limit;
  const paginated = products.slice(offset, offset + limit);
  return { products: paginated, totalProducts };
}

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('name') || undefined;
  const pageLimit = searchParamsCache.get('perPage') || 10;
  const categories = searchParamsCache.get('category') || undefined;

  const { products, totalProducts } = await fetchProducts({
    page,
    limit: pageLimit,
    search,
    categories
  });

  if (totalProducts === 0) {
    return (
      <div className='rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center text-[var(--color-foreground)] shadow-md'>
        <div className='mb-2 text-lg font-semibold'>No products found</div>
        <div className='mb-2'>It looks like your database is empty.</div>
        <div className='text-sm text-[var(--color-muted-foreground)]'>
          Run{' '}
          <code className='rounded bg-[var(--color-muted)] px-2 py-1 font-mono'>
            npm run seed
          </code>{' '}
          to populate sample products.
        </div>
      </div>
    );
  }

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
