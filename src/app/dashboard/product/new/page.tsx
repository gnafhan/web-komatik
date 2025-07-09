import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductForm from '@/features/products/components/product-form';

export const metadata = {
  title: 'Dashboard: Add New Product'
};

export default function NewProductPage() {
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductForm initialData={null} pageTitle='Add New Product' />
        </Suspense>
      </div>
    </PageContainer>
  );
}
