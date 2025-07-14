import DivisionListing from './division-listing';
import DivisionCreateForm from './division-create-form';

export default function DivisionViewPage() {
  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold'>Divisions</h1>
      <DivisionListing />
    </div>
  );
}
