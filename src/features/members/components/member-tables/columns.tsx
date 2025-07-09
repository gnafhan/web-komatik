'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Member } from '@/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { Text } from 'lucide-react';
import { ClientSideDate } from '@/components/client-side-date';

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'photo_url',
    header: 'IMAGE',
    size: 50,
    cell: ({ row }) => {
      const photoUrl = row.getValue('photo_url') as string;
      return (
        <div className='relative h-10 w-10'>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={row.getValue('name')}
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
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Member, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Member['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search members...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true,
    size: 250
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    size: 250
  },
  {
    accessorKey: 'phone',
    header: 'PHONE',
    size: 150
  },
  {
    accessorKey: 'student_id',
    header: 'STUDENT ID',
    size: 150
  },
  {
    accessorKey: 'bio',
    header: 'BIO',
    size: 250
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Member, unknown> }) => (
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
    header: ({ column }: { column: Column<Member, unknown> }) => (
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
