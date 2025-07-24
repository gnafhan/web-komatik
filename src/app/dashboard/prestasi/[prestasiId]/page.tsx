import PrestasiViewPage from '@/features/prestasi/components/prestasi-view-page';

type PageProps = { params: Promise<{ prestasiId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return <PrestasiViewPage prestasiId={params.prestasiId} />;
}
