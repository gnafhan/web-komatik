import { notFound } from 'next/navigation';
import ProductForm from '@/features/products/components/product-form';
import { getPeriodById } from '../utils';
import { Period } from '@/types';
import PeriodForm from './period-form';

type TPeriodViewPageProps = {
  periodId: string;
};

export default async function PeriodViewPage({
  periodId
}: TPeriodViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Period';

  if (periodId !== 'new') {
    const data = await getPeriodById(Number(periodId));
    product = data as Period;
    if (!product) {
      notFound();
    }
    pageTitle = `Edit Period`;
  }

  return <PeriodForm initialData={product} pageTitle={pageTitle} />;
}
