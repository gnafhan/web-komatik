'use client';

import * as React from 'react';

import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';

interface DataTableToolbarProps extends React.ComponentProps<'div'> {
  table: any; // Changed from Table<TData> to any as Column is removed
}

export function DataTableToolbar({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  // Add search param wiring
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = React.useState(search);
  // Debounce for search input
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.replace('?' + params.toString());
      router.refresh();
    }, 400);
  };

  React.useEffect(() => {
    setSearchInput(search);
  }, [search]);

  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn(
        'flex w-full items-start justify-between gap-2 p-1',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        {/* Only render the global search input once, before other filters */}
        <Input
          placeholder='Search Prestasi...'
          value={searchInput}
          onChange={handleSearchChange}
          className='h-8 w-40 lg:w-56'
        />
        {/* Date filters removed as requested */}
        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='outline'
            size='sm'
            className='border-dashed'
            onClick={onReset}
          >
            <Cross2Icon />
            Reset
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
