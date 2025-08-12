import { getTentangKami } from '../actions';
import TentangKamiForm from './tentang-kami-form';
import { type TentangKamiFormValues } from '../schema';

export default async function TentangKamiEditPage() {
  const result = await getTentangKami();

  if (!result.success) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <p className='text-lg font-semibold text-red-600'>
            Error loading data
          </p>
          <p className='text-sm text-gray-600'>
            {'message' in result ? result.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <TentangKamiForm
      initialData={
        'data' in result ? (result.data as TentangKamiFormValues) : undefined
      }
    />
  );
}
