import PrestasiViewPage from '@/features/prestasi/components/prestasi-view-page';

export default function Page({ params }: { params: { prestasiId: string } }) {
  return <PrestasiViewPage prestasiId={params.prestasiId} />;
}
