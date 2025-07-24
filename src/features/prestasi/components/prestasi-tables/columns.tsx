'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Prestasi } from '@/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { Text } from 'lucide-react';
import { ClientSideDate } from '@/components/client-side-date';

export const columns: ColumnDef<Prestasi>[] = [
  {
    accessorKey: 'image_url',
    header: 'IMAGE',
    size: 50,
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string;
      return (
        <div className='relative h-10 w-10'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.getValue('title')}
              fill
              className='rounded-lg object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-lg bg-gray-200'>
              <span className='text-[8px] text-gray-500'>No Image</span>
            </div>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'title',
    header: ({ column }: { column: Column<Prestasi, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Prestasi['title']>()}</div>,
    size: 200
  },
  {
    accessorKey: 'team_name',
    header: 'TEAM',
    size: 150
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY',
    size: 120
  },
  {
    accessorKey: 'award',
    header: 'AWARD',
    size: 120
  },
  {
    accessorKey: 'year',
    header: 'YEAR',
    size: 80
  },
  {
    accessorKey: 'members',
    header: 'MEMBERS',
    size: 200,
    cell: ({ row }) => {
      const members = row.getValue('members') as string[];
      const membersMap = (row.original as any).membersMap as Record<
        string,
        string
      >;
      const names = (members || []).map((id) => membersMap?.[id] || id);
      const display = names.slice(0, 3).join(', ');
      const more = names.length > 3 ? ` +${names.length - 3} more` : '';
      return (
        <span>
          {display}
          {more}
        </span>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Prestasi, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => (
      <ClientSideDate dateString={row.getValue('created_at')} />
    ),
    meta: {
      label: 'Created At',
      variant: 'dateRange'
    },
    enableColumnFilter: true,
    size: 200
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }: { column: Column<Prestasi, unknown> }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    ),
    cell: ({ row }) => (
      <ClientSideDate dateString={row.getValue('updated_at')} />
    ),
    meta: {
      label: 'Updated At',
      variant: 'dateRange'
    },
    enableColumnFilter: true,
    size: 200
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 50
  }
];
