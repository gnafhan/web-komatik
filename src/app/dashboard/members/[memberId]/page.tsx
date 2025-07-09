import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import MemberViewPage from '@/features/members/components/member-view-page';

export const metadata = {
  title: 'Dashboard : Member View'
};

type PageProps = { params: Promise<{ memberId: string }> };

export default async function Page(props: PageProps) {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <MemberViewPage memberId={(await props.params).memberId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
