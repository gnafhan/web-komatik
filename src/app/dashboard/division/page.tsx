import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { Heading } from '@/components/ui/heading';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import DivisionListingPage from '@/features/divisions/components/division-listing';

export const metadata = {
  title: 'Dashboard: Divisions'
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const { page, name, perPage } = searchParams;

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Divisions'
            description='Manage divisions of the organization.'
          />
          <Link
            href='/dashboard/division/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <DivisionListingPage page={page} name={name} perPage={perPage} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
