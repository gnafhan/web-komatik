import { Division } from '@/types';
import { db } from '@/database/connection/firebase.server';
import DivisionClient from './division-client';

async function fetchDivisions({
  page = 1,
  limit = 10,
  search
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  // WARNING: Offset-based pagination is inefficient in Firestore for large offsets.
  // For best performance, migrate to cursor-based pagination in the UI.
  let query = db.collection('divisions').orderBy('order_index', 'asc');

  // Firestore only supports prefix search on a single field efficiently.
  // Here, we support prefix search on 'name' only.
  if (search) {
    // Prefix search: name >= search && name < search + \uf8ff
    query = query
      .where('name', '>=', search)
      .where('name', '<=', search + '\uf8ff');
  }

  // For offset-based pagination, fetch (page * limit) docs and slice in memory.
  // This is inefficient for large page numbers.
  const snapshot = await query.limit(page * limit).get();

  let divisions = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate?.().toISOString() || null,
      updated_at: data.updated_at?.toDate?.().toISOString() || null
    } as Division;
  });

  // Only keep the current page's items
  const paginatedDivisions = divisions.slice((page - 1) * limit, page * limit);

  // Get total count (inefficient: requires a separate query)
  let totalDivisions = 0;
  if (search) {
    // Count with the same filter
    const countSnap = await db
      .collection('divisions')
      .where('name', '>=', search)
      .where('name', '<=', search + '\uf8ff')
      .get();
    totalDivisions = countSnap.size;
  } else {
    const countSnap = await db.collection('divisions').get();
    totalDivisions = countSnap.size;
  }

  return { divisions: paginatedDivisions, totalDivisions };
}

type DivisionListingPageProps = {
  page?: string | string[];
  name?: string | string[];
  perPage?: string | string[];
};

export default async function DivisionListingPage({
  page: pageParam,
  name: nameParam,
  perPage: perPageParam
}: DivisionListingPageProps) {
  const page = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1;
  const search = Array.isArray(nameParam) ? nameParam[0] : nameParam;
  const pageLimit =
    Number(Array.isArray(perPageParam) ? perPageParam[0] : perPageParam) || 10;

  const { divisions, totalDivisions } = await fetchDivisions({
    page,
    limit: pageLimit,
    search
  });

  return <DivisionClient data={divisions} totalItems={totalDivisions} />;
}
