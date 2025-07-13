import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import MemberViewPage from '@/features/members/components/member-view-page';

export const metadata = {
  title: 'Dashboard : Member View'
};

type PageProps = { params: { memberId: string } };

export default function Page({ params }: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <MemberViewPage memberId={params.memberId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
