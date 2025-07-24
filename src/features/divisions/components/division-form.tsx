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
import { Textarea } from '@/components/ui/textarea';
import { Division } from '@/types';
import { useRouter } from 'next/navigation';
import { divisionSchema } from '../schema';
import { useServerForm } from '@/hooks/use-server-form';
import { addDivision, updateDivision } from '../actions';

export default function DivisionForm({
  initialData,
  pageTitle
}: {
  initialData: Division | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const formSchema = divisionSchema;

  const { form, onSubmit, isPending } = useServerForm({
    schema: formSchema,
    action: async (values) => {
      if (initialData) {
        await updateDivision(initialData.id, values);
        return { success: true, message: 'Division updated' };
      } else {
        await addDivision(values);
        return { success: true, message: 'Division created' };
      }
    },
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      order_index: initialData?.order_index ?? 0
    },
    onSuccess: () => {
      router.push('/dashboard/division');
    }
  });

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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='order_index'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Index</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? '' : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
