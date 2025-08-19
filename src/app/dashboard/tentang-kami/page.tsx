import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import FormCardSkeleton from '@/components/form-card-skeleton';
import TentangKamiEditPage from '@/features/tentang-kami/components/tentang-kami-edit-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Tentang Kami'
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Tentang Kami'
            description='Manage content for the About Us section.'
          />
        </div>
        <Separator />
        <Suspense fallback={<FormCardSkeleton />}>
          <TentangKamiEditPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
