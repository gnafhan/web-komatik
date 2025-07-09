'use client';

import { FileUploader } from '@/components/file-uploader';
import Image from 'next/image';
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
import { db, storage } from '@/database/connection/firebase.client';
import { Member } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  setDoc,
  doc,
  collection,
  getDocs,
  query,
  updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const getFormSchema = (isEditing: boolean) =>
  z.object({
    photo_url: z
      .any()
      .refine(
        (files) => isEditing || (files && files.length > 0),
        'Image is required.'
      )
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          typeof files === 'string' ||
          files?.[0]?.size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`
      )
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          typeof files === 'string' ||
          ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        '.jpg, .jpeg, .png and .webp files are accepted.'
      ),
    name: z.string().min(2, {
      message: 'Member name must be at least 2 characters.'
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.'
    }),
    phone: z.string().min(10, {
      message: 'Phone number must be at least 10 characters.'
    }),
    student_id: z.string().min(5, {
      message: 'Student ID must be at least 5 characters.'
    }),
    bio: z.string().min(10, {
      message: 'Bio must be at least 10 characters.'
    })
  });

export default function MemberForm({
  initialData,
  pageTitle
}: {
  initialData: Member | null;
  pageTitle: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formSchema = getFormSchema(!!initialData);

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
    try {
      setIsLoading(true);

      let photoUrl = initialData?.photo_url || '';
      if (
        values.photo_url &&
        values.photo_url.length > 0 &&
        values.photo_url[0] instanceof File
      ) {
        const imageFile = values.photo_url[0];
        const storageRef = ref(
          storage,
          `members/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        photoUrl = await getDownloadURL(storageRef);
      }

      if (initialData) {
        const memberRef = doc(db, 'members', initialData.uid);
        await updateDoc(memberRef, {
          ...values,
          photo_url: photoUrl,
          updated_at: new Date()
        });
        toast.success('Member updated successfully');
        router.push('/dashboard/members');
        router.refresh();
      } else {
        const membersCollection = collection(db, 'members');
        const newMemberRef = doc(membersCollection);

        const querySnapshot = await getDocs(query(membersCollection));
        const newId = querySnapshot.size + 1;

        await setDoc(newMemberRef, {
          ...values,
          id: newId,
          uid: newMemberRef.id,
          photo_url: photoUrl,
          created_at: new Date(),
          updated_at: new Date()
        });

        toast.success('Member added successfully');
        router.push('/dashboard/members');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                        maxSize={4 * 1024 * 1024}
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
            <Button type='submit' disabled={isLoading}>
              {isLoading
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
