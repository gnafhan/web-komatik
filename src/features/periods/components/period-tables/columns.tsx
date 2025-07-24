'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Period } from '@/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { CATEGORY_OPTIONS } from './options';

export const columns: ColumnDef<Period>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Period, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Period['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search products...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'is_active',
    accessorKey: 'is_active',
    header: ({ column }: { column: Column<Period, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      let status = cell.getValue<Period['is_active']>();
      const teks = status ? 'active' : 'inactive';

      return (
        <Badge variant='outline' className='capitalize'>
          {teks}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status',
      variant: 'boolean',
      options: CATEGORY_OPTIONS
    }
  },
  {
    id: 'start_date',
    accessorKey: 'start_date',
    header: 'START DATE',
    size: 250,
    cell: ({ cell }) => {
      const date = cell.getValue<Period['start_date']>();
      return <div>{date ? new Date(date).toLocaleDateString() : '-'}</div>;
    }
  },
  {
    id: 'end_date',
    accessorKey: 'end_date',
    header: 'END DATE',
    size: 250,
    cell: ({ cell }) => {
      const date = cell.getValue<Period['end_date']>();
      return <div>{date ? new Date(date).toLocaleDateString() : '-'}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 100
  }
];
