import { Division } from '@/types';
import { columns } from './division-tables/columns';
import { DivisionTable } from './division-tables';

type DivisionClientProps = {
  data: Division[];
  totalItems: number;
};

export default function DivisionClient({
  data,
  totalItems
}: DivisionClientProps) {
  return (
    <DivisionTable data={data} totalItems={totalItems} columns={columns} />
  );
}
