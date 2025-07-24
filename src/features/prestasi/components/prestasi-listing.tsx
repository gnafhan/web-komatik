import { Prestasi } from '@/types';
import { db } from '@/database/connection/firebase.server';
import PrestasiClient from './prestasi-client';

async function fetchPrestasiList({
  _page = 1,
  _limit = 10,
  _search
}: {
  _page?: number;
  _limit?: number;
  _search?: string;
}) {
  const prestasiRef = db.collection('prestasi');
  const snapshot = await prestasiRef.orderBy('created_at', 'desc').get();

  let prestasi = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate?.().toISOString() || null,
      updated_at: data.updated_at?.toDate?.().toISOString() || null
    } as Prestasi;
  });

  // Fetch all members and build a map of id to name
  const membersSnapshot = await db.collection('members').get();
  const membersMap: Record<string, string> = Object.fromEntries(
    membersSnapshot.docs.map((doc) => [doc.id, doc.data().name])
  );

  // Attach membersMap to each prestasi row
  prestasi = prestasi.map((item) => ({ ...item, membersMap }));

  return { prestasi, totalPrestasi: prestasi.length };
}

type PrestasiListingPageProps = {
  page?: string | string[];
  search?: string | string[];
  perPage?: string | string[];
  createdAtFrom?: string | string[];
  createdAtTo?: string | string[];
  updatedAtFrom?: string | string[];
  updatedAtTo?: string | string[];
};

export default async function PrestasiListingPage({
  page: pageParam,
  search: searchParam,
  perPage: perPageParam,
  createdAtFrom,
  createdAtTo,
  updatedAtFrom,
  updatedAtTo
}: PrestasiListingPageProps) {
  const _page =
    Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1;
  const _search = Array.isArray(searchParam) ? searchParam[0] : searchParam;
  const pageLimit =
    Number(Array.isArray(perPageParam) ? perPageParam[0] : perPageParam) || 10;
  const createdFrom = Array.isArray(createdAtFrom)
    ? createdAtFrom[0]
    : createdAtFrom;
  const createdTo = Array.isArray(createdAtTo) ? createdAtTo[0] : createdAtTo;
  const updatedFrom = Array.isArray(updatedAtFrom)
    ? updatedAtFrom[0]
    : updatedAtFrom;
  const updatedTo = Array.isArray(updatedAtTo) ? updatedAtTo[0] : updatedAtTo;

  let { prestasi, totalPrestasi } = await fetchPrestasiList({
    _page: _page,
    _limit: pageLimit,
    _search: _search
  });

  // Server-side search filtering
  if (_search) {
    const s = _search.toLowerCase();
    prestasi = prestasi.filter(
      (item) =>
        item.title.toLowerCase().includes(s) ||
        item.team_name.toLowerCase().includes(s) ||
        item.category.toLowerCase().includes(s) ||
        item.award.toLowerCase().includes(s) ||
        String(item.year).toLowerCase().includes(s)
    );
  }
  // Server-side date filtering
  if (createdFrom) {
    prestasi = prestasi.filter(
      (item) =>
        item.created_at &&
        new Date(String(item.created_at)) >= new Date(createdFrom)
    );
  }
  if (createdTo) {
    prestasi = prestasi.filter(
      (item) =>
        item.created_at &&
        new Date(String(item.created_at)) <= new Date(createdTo)
    );
  }
  if (updatedFrom) {
    prestasi = prestasi.filter(
      (item) =>
        item.updated_at &&
        new Date(String(item.updated_at)) >= new Date(updatedFrom)
    );
  }
  if (updatedTo) {
    prestasi = prestasi.filter(
      (item) =>
        item.updated_at &&
        new Date(String(item.updated_at)) <= new Date(updatedTo)
    );
  }

  totalPrestasi = prestasi.length;
  const paginatedPrestasi = prestasi.slice(
    (_page - 1) * pageLimit,
    _page * pageLimit
  );

  return (
    <PrestasiClient
      prestasi={paginatedPrestasi}
      totalPrestasi={totalPrestasi}
    />
  );
}
