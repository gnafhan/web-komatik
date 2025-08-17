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
import { useRouter } from 'next/navigation';
import { updateTentangKami } from '../actions';
import { tentangKamiSchema, type TentangKamiFormValues } from '../schema';
import { Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';

interface TentangKamiFormProps {
  initialData?: TentangKamiFormValues;
}

export default function TentangKamiForm({ initialData }: TentangKamiFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  console.log(initialData);
  const form = useForm<TentangKamiFormValues>({
    resolver: zodResolver(tentangKamiSchema),
    defaultValues: {
      hero_title: initialData?.hero_title || 'Tentang Kami',
      hero_description:
        initialData?.hero_description ||
        'KOMATIK UGM hadir untuk membina, memfasilitasi, dan mendorong mahasiswa UGM berprestasi di bidang TIK.',
      about_title: initialData?.about_title || 'Apa itu KOMATIK?',
      about_description: initialData?.about_description || '',
      objectives_title: initialData?.objectives_title || 'Tujuan KOMATIK',
      objectives_description:
        initialData?.objectives_description ||
        'KOMATIK UGM memiliki beberapa tujuan yang menjadi dasar dari seluruh aktivitas dan program yang dijalankan, antara lain:',
      objectives: initialData?.objectives || [
        'Menjadi wadah berkumpul mahasiswa yang minat terhadap Teknologi Informasi dan Komunikasi',
        'Mengembangkan kreativitas dan kemampuan mahasiswa dalam bidang Teknologi Informasi dan Komunikasi',
        'Memotivasi mahasiswa untuk berperan dalam mengembangkan dunia Teknologi Informasi dan Komunikasi',
        'Memberikan kontribusi terhadap UGM dalam bentuk riset dan pencapaian'
      ],
      video_title: initialData?.video_title || 'Video Profile',
      video_url:
        initialData?.video_url || 'https://www.youtube.com/embed/lelkP0nqxzc'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'objectives' as const
  });

  const addObjective = () => {
    append('');
  };

  const removeObjective = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (values: TentangKamiFormValues) => {
    setIsPending(true);
    try {
      const formData = new FormData();

      const { objectives, ...otherValues } = values;

      Object.entries(otherValues).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      objectives.forEach((objective, index) => {
        formData.append(`objectives[${index}]`, objective);
      });

      const result = await updateTentangKami(formData);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        if ('errors' in result && result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            if (value) {
              form.setError(key as any, {
                type: 'server',
                message: (value as string[]).join(', ')
              });
            }
          });
        }
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Edit Tentang Kami Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='rounded-lg border p-4'>
              <h3 className='mb-4 text-lg font-semibold'>Hero Section</h3>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='hero_title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Tentang Kami' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='hero_description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='KOMATIK UGM hadir untuk...'
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='rounded-lg border p-4'>
              <h3 className='mb-4 text-lg font-semibold'>
                Apa Itu KOMATIK Section
              </h3>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='about_title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Apa itu KOMATIK?' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='about_description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Komunitas Mahasiswa Teknologi Informasi...'
                          className='min-h-[120px] resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='rounded-lg border p-4'>
              <h3 className='mb-4 text-lg font-semibold'>
                Tujuan KOMATIK Section
              </h3>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='objectives_title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objectives Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Tujuan KOMATIK' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='objectives_description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objectives Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='KOMATIK UGM memiliki beberapa tujuan...'
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className='text-base font-medium'>
                      Objectives
                    </FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={addObjective}
                      className='flex items-center gap-2'
                    >
                      <Plus className='h-4 w-4' />
                      Add Objective
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className='flex items-center gap-2'>
                      <div className='flex-1'>
                        <FormField
                          control={form.control}
                          name={`objectives.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='sr-only'>
                                Objective {index + 1}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={`Objective ${index + 1}...`}
                                  className='resize-none'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => removeObjective(index)}
                        disabled={fields.length === 1}
                        className='flex h-10 shrink-0 items-center gap-1 self-center'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='rounded-lg border p-4'>
              <h3 className='mb-4 text-lg font-semibold'>
                Video Profile Section
              </h3>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='video_title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Title</FormLabel>
                      <FormControl>
                        <Input placeholder='Video Profile' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='video_url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Embed URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://www.youtube.com/embed/...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type='submit' disabled={isPending}>
              {isPending ? 'Updating...' : 'Update Content'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
