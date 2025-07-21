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
  const divisionsRef = db.collection('divisions');
  const snapshot = await divisionsRef.orderBy('order_index', 'asc').get();

  let divisions = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate?.().toISOString() || null,
      updated_at: data.updated_at?.toDate?.().toISOString() || null
    } as Division;
  });

  if (search) {
    const s = search.toLowerCase();
    divisions = divisions.filter(
      (division) =>
        division.name.toLowerCase().includes(s) ||
        division.slug.toLowerCase().includes(s) ||
        division.description.toLowerCase().includes(s)
    );
  }

  const totalDivisions = divisions.length;
  const paginatedDivisions = divisions.slice((page - 1) * limit, page * limit);

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
