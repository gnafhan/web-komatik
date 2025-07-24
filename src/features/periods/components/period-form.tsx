'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { updatePeriodByFieldId } from '../utils';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/database/connection/firebase.client';
import { Timestamp } from 'firebase/firestore';
import { Period } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  is_active: z.enum(['true', 'false']),
  start_date: z.string().min(1, { message: 'Start date is required.' }),
  end_date: z.string().min(1, { message: 'End date is required.' })
});

export default function PeriodForm({
  initialData,
  pageTitle
}: {
  initialData: Period | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const defaultValues: {
    name: string;
    is_active: 'true' | 'false';
    start_date: string;
    end_date: string;
  } = {
    name: initialData?.name || '',
    is_active:
      initialData?.is_active === undefined
        ? 'true'
        : initialData.is_active
          ? 'true'
          : 'false',
    start_date: initialData?.start_date
      ? new Date(initialData.start_date).toISOString().slice(0, 10)
      : '',
    end_date: initialData?.end_date
      ? new Date(initialData.end_date).toISOString().slice(0, 10)
      : ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function getNextPeriodId(): Promise<number> {
    const snapshot = await getDocs(collection(db, 'periods'));
    let maxId = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Pastikan id bertipe number
      if (typeof data.id === 'number' && data.id > maxId) {
        maxId = data.id;
      }
    });
    return maxId + 1;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const now = Timestamp.now();
    const id = initialData?.id ?? (await getNextPeriodId());
    const periodData: Period = {
      name: values.name,
      is_active: values.is_active === 'true',
      start_date: new Date(values.start_date),
      end_date: new Date(values.end_date),
      id: id,
      created_at: initialData?.created_at ?? now,
      updated_at: now
    };
    if (initialData?.id) {
      await updatePeriodByFieldId(initialData.id, periodData);
    } else {
      await addDoc(collection(db, 'periods'), periodData);
    }
    router.push('/dashboard/periods');
  }
  const { isSubmitting } = form.formState;
  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter period name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_active'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='true'>Active</SelectItem>
                      <SelectItem value='false'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='end_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Period'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
