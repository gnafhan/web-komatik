'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Division } from '@/types';
import { Column, ColumnDef } from '@tanstack/react-table';

import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Division>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Division, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Division['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search divisions...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true,
    size: 200
  },
  {
    accessorKey: 'slug',
    header: 'SLUG',
    size: 150
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION',
    size: 250
  },
  {
    accessorKey: 'order_index',
    header: 'ORDER',
    size: 80
  },
  {
    accessorKey: 'created_at',
    header: 'CREATED AT',
    size: 180
  },
  {
    accessorKey: 'updated_at',
    header: 'UPDATED AT',
    size: 180
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 50
  }
];
