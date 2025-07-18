'use client';

import { Member } from '@/types';
import { useSearchParams } from 'next/navigation';
import { MemberTable } from './member-tables';
import { columns } from './member-tables/columns';

type MemberClientProps = {
  members: Member[];
  totalMembers: number;
};

export default function MemberClient({
  members,
  totalMembers
}: MemberClientProps) {
  const searchParams = useSearchParams();
  const hasSearchFilter = searchParams.has('name');

  if (totalMembers === 0 && !hasSearchFilter) {
    return (
      <div className='rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center text-[var(--color-foreground)] shadow-md'>
        <div className='mb-2 text-lg font-semibold'>No members found</div>
        <div className='mb-2'>It looks like your database is empty.</div>
        <div className='text-sm text-[var(--color-muted-foreground)]'>
          Add a new member to get started.
        </div>
      </div>
    );
  }

  return (
    <MemberTable data={members} totalItems={totalMembers} columns={columns} />
  );
}
