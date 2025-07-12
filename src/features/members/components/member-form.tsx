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
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { addMember, updateMember } from '../actions';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export default function MemberForm({
  initialData,
  pageTitle
}: {
  initialData: Member | null;
  pageTitle: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const formSchema = z
    .object({
      name: z
        .string()
        .min(2, { message: 'Member name must be at least 2 characters.' }),
      email: z
        .string()
        .email({ message: 'Please enter a valid email address.' }),
      phone: z
        .string()
        .min(10, { message: 'Phone number must be at least 10 characters.' }),
      student_id: z
        .string()
        .min(5, { message: 'Student ID must be at least 5 characters.' }),
      bio: z
        .string()
        .min(10, { message: 'Bio must be at least 10 characters.' }),
      photo_url: z.any()
    })
    .superRefine((data, ctx) => {
      const { photo_url } = data;
      const isNewFile = photo_url?.[0] instanceof File;

      if (initialData) {
        // Edit mode: if a new file is provided, it must be valid.
        if (isNewFile) {
          if (photo_url[0].size > MAX_FILE_SIZE) {
            ctx.addIssue({
              code: 'custom',
              path: ['photo_url'],
              message: 'Max file size is 5MB.'
            });
          }
          if (!ACCEPTED_IMAGE_TYPES.includes(photo_url[0].type)) {
            ctx.addIssue({
              code: 'custom',
              path: ['photo_url'],
              message: '.jpg, .jpeg, .png and .webp files are accepted.'
            });
          }
        }
      } else {
        // Create mode: a new file is required and must be valid.
        if (!isNewFile) {
          ctx.addIssue({
            code: 'custom',
            path: ['photo_url'],
            message: 'Image is required.'
          });
        } else {
          if (photo_url[0].size > MAX_FILE_SIZE) {
            ctx.addIssue({
              code: 'custom',
              path: ['photo_url'],
              message: 'Max file size is 5MB.'
            });
          }
          if (!ACCEPTED_IMAGE_TYPES.includes(photo_url[0].type)) {
            ctx.addIssue({
              code: 'custom',
              path: ['photo_url'],
              message: '.jpg, .jpeg, .png and .webp files are accepted.'
            });
          }
        }
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      student_id: initialData?.student_id || '',
      bio: initialData?.bio || '',
      photo_url: initialData?.photo_url || undefined
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    const { photo_url, ...otherValues } = values;

    Object.entries(otherValues).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (photo_url && photo_url[0] instanceof File) {
      formData.append('photo_url', photo_url[0]);
    }

    startTransition(async () => {
      try {
        const result = initialData
          ? await updateMember(initialData.id, formData)
          : await addMember(formData);

        if (result.success) {
          toast.success(result.message);
          router.push('/dashboard/members');
        } else {
          if (result.errors) {
            Object.entries(result.errors).forEach(([key, value]) => {
              if (value) {
                form.setError(key as keyof z.infer<typeof formSchema>, {
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
      }
    });
  }

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
                        value={Array.isArray(field.value) ? field.value : []}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={MAX_FILE_SIZE}
                        imageUrl={
                          initialData?.photo_url &&
                          typeof field.value === 'string'
                            ? field.value
                            : undefined
                        }
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
