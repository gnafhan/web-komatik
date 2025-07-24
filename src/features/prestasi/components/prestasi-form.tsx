'use client';

import { FileUploader } from '@/components/file-uploader';
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
import { Member, Prestasi } from '@/types';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { addPrestasi, updatePrestasi } from '../actions';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, prestasiSchema } from '../schema';
import { useServerForm } from '@/hooks/use-server-form';
import { useEffect, useState } from 'react';
import MemberMultiSelect from './MemberMultiSelect';
import EnumSelectWithAdd from './EnumSelectWithAdd';
import {
  addCategory,
  addAward,
  fetchCategories,
  fetchAwards as fetchAwardsAction
} from '../actions';
import { Controller } from 'react-hook-form';

export default function PrestasiForm({
  initialData,
  pageTitle,
  members
}: {
  initialData: Prestasi | null;
  pageTitle: string;
  members: Member[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [awards, setAwards] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchAwardsAction().then(setAwards);
  }, []);

  const handleAddCategory = async (cat: string) => {
    await addCategory(cat);
    setCategories(await fetchCategories());
  };
  const handleAddAward = async (aw: string) => {
    await addAward(aw);
    setAwards(await fetchAwardsAction());
  };

  const formSchema = prestasiSchema
    .extend({
      image_url: z.any().optional(),
      members: z.array(z.string()).min(1, 'At least one member is required.'),
      award: z.string().min(2, 'Award is required.'),
      category: z.string().min(2, 'Category is required.')
    })
    .refine(
      (data) => {
        if (!initialData) {
          return data.image_url?.[0] instanceof File;
        }
        return true;
      },
      {
        message: 'Image is required.',
        path: ['image_url']
      }
    )
    .refine(
      (data) => {
        if (data.image_url?.[0] instanceof File) {
          return data.image_url[0].size <= MAX_FILE_SIZE;
        }
        return true;
      },
      {
        message: `Max file size is 5MB.`,
        path: ['image_url']
      }
    )
    .refine(
      (data) => {
        if (data.image_url?.[0] instanceof File) {
          return ACCEPTED_IMAGE_TYPES.includes(data.image_url[0].type);
        }
        return true;
      },
      {
        message: '.jpg, .jpeg, .png and .webp files are accepted.',
        path: ['image_url']
      }
    );

  const { form, onSubmit, isPending } = useServerForm({
    schema: formSchema,
    action: async (values) => {
      const formData = new FormData();
      const { image_url, members, ...otherValues } = values;
      Object.entries(otherValues).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      members.forEach((id: string) => formData.append('members', id));
      if (image_url && image_url[0] instanceof File) {
        formData.append('image_url', image_url[0]);
      }
      return initialData
        ? await updatePrestasi(initialData.id, formData)
        : await addPrestasi(formData);
    },
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      team_name: initialData?.team_name || '',
      members: Array.isArray(initialData?.members)
        ? initialData.members.map((m: any) =>
            typeof m === 'string' ? m : m.id
          )
        : [],
      category: initialData?.category || '',
      award: initialData?.award || '',
      year: initialData?.year
        ? String(new Date(initialData.year).getFullYear())
        : '',
      image_url: undefined
    },
    onSuccess: () => {
      router.push('/dashboard/prestasi');
    }
  });

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className='max-h-[calc(100vh-200px)] overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='image_url'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>
                      {initialData?.image_url ? 'Change Image' : 'Image'}
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value?.[0] ? [field.value[0]] : []}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={MAX_FILE_SIZE}
                        imageUrl={initialData?.image_url}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter prestasi title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='team_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter team name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <EnumSelectWithAdd
                        label='Category'
                        options={categories}
                        value={field.value}
                        onChange={field.onChange}
                        onAdd={handleAddCategory}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='year'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='e.g. 2024' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name='members'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <FormControl>
                    <MemberMultiSelect
                      members={members}
                      value={
                        Array.isArray(field.value)
                          ? field.value
                          : field.value
                            ? [String(field.value)]
                            : []
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='award'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Award</FormLabel>
                  <FormControl>
                    <EnumSelectWithAdd
                      label='Award'
                      options={awards}
                      value={field.value}
                      onChange={field.onChange}
                      onAdd={handleAddAward}
                    />
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
                    <Textarea
                      placeholder='Enter prestasi description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isPending}>
              {isPending
                ? initialData
                  ? 'Updating...'
                  : 'Adding...'
                : initialData
                  ? 'Update Prestasi'
                  : 'Add Prestasi'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
