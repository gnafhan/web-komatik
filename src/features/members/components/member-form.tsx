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
import { Member } from '@/types';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { addMember, updateMember } from '../actions';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE, memberSchema } from '../schema';
import { useServerForm } from '@/hooks/use-server-form';

export default function MemberForm({
  initialData,
  pageTitle
}: {
  initialData: Member | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const formSchema = memberSchema
    .extend({
      photo_url: z.any().optional()
    })
    .refine(
      (data) => {
        if (!initialData) {
          return data.photo_url?.[0] instanceof File;
        }
        return true;
      },
      {
        message: 'Image is required.',
        path: ['photo_url']
      }
    )
    .refine(
      (data) => {
        if (data.photo_url?.[0] instanceof File) {
          return data.photo_url[0].size <= MAX_FILE_SIZE;
        }
        return true;
      },
      {
        message: `Max file size is 5MB.`,
        path: ['photo_url']
      }
    )
    .refine(
      (data) => {
        if (data.photo_url?.[0] instanceof File) {
          return ACCEPTED_IMAGE_TYPES.includes(data.photo_url[0].type);
        }
        return true;
      },
      {
        message: '.jpg, .jpeg, .png and .webp files are accepted.',
        path: ['photo_url']
      }
    );

  const { form, onSubmit, isPending } = useServerForm({
    schema: formSchema,
    action: async (values) => {
      const formData = new FormData();
      const { photo_url, ...otherValues } = values;

      Object.entries(otherValues).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      if (photo_url && photo_url[0] instanceof File) {
        formData.append('photo_url', photo_url[0]);
      }

      return initialData
        ? await updateMember(initialData.id, formData)
        : await addMember(formData);
    },
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      student_id: initialData?.student_id || '',
      bio: initialData?.bio || '',
      photo_url: undefined
    },
    onSuccess: () => {
      router.push('/dashboard/members');
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
              name='photo_url'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>
                      {initialData?.photo_url ? 'Change Photo' : 'Photo'}
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value?.[0] ? [field.value[0]] : []}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={MAX_FILE_SIZE}
                        imageUrl={initialData?.photo_url}
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter member name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter phone number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='student_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter student ID' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter member bio'
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
                  ? 'Update Member'
                  : 'Add Member'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
