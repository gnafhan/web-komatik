import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import DivisionViewPage from '@/features/divisions/components/division-view-page';

export const metadata = {
  title: 'Dashboard : Division View'
};

type PageProps = { params: Promise<{ divisionId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DivisionViewPage divisionId={params.divisionId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
