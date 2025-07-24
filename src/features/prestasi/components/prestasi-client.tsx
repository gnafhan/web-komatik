'use client';
import { Prestasi } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { columns } from './prestasi-tables';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';

export default function PrestasiClient({
  prestasi,
  totalPrestasi
}: {
  prestasi: Prestasi[];
  totalPrestasi: number;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  if (totalPrestasi === 0 && !search) {
    return (
      <div className='rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center text-[var(--color-foreground)] shadow-md'>
        <div className='mb-2 text-lg font-semibold'>No prestasi found</div>
        <div className='mb-2'>It looks like your database is empty.</div>
        <div className='text-sm text-[var(--color-muted-foreground)]'>
          Add a new prestasi to get started.
        </div>
      </div>
    );
  }

  const pageCount = Math.ceil(totalPrestasi / 10); // Default page size 10
  const { table } = useDataTable({
    data: prestasi,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
