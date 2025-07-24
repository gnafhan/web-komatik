import { Period } from '@/types';
import { searchParamsCache } from '@/lib/searchparams';
import { PeriodTable } from './period-tables';
import { columns } from './period-tables/columns';
import { db } from '@/database/connection/firebase.client';
import { collection, getDocs, query, limit } from 'firebase/firestore';

// Helper to fetch products from Firestore
async function fetchProducts({
  page = 1,
  limit = 10,
  search,
  active
}: {
  page?: number;
  limit?: number;
  search?: string;
  active?: string;
}) {
  let q = query(collection(db, 'periods'));
  // Filtering and search logic can be extended here
  // For now, just fetch all and paginate client-side
  const snapshot = await getDocs(q);
  let periods: Period[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      start_date: data.start_date?.toDate()?.toISOString(),
      end_date: data.end_date?.toDate()?.toISOString(),
      created_at: data.created_at?.toDate()?.toISOString(),
      updated_at: data.updated_at?.toDate()?.toISOString()
    } as Period;
  });
  if (active) {
    const cats = active === 'active' ? true : false;
    periods = periods.filter((p) => p.is_active === cats);
  }
  if (search) {
    const s = search.toLowerCase();
    periods = periods.filter((p) => p.name.toLowerCase().includes(s));
  }
  const totalProducts = periods.length;
  const offset = (page - 1) * limit;
  const paginated = periods.slice(offset, offset + limit);
  return { products: paginated, totalProducts };
}

export default async function ProductListingPage() {
  const page = searchParamsCache.get('page') || 1;
  const search = searchParamsCache.get('name') || undefined;
  const pageLimit = searchParamsCache.get('perPage') || 10;
  const active = searchParamsCache.get('active') || undefined;

  const { products, totalProducts } = await fetchProducts({
    page,
    limit: pageLimit,
    search,
    active
  });

  return (
    <PeriodTable data={products} totalItems={totalProducts} columns={columns} />
  );
}
