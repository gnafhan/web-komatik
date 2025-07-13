import * as z from 'zod';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters.'),
  student_id: z.string().min(5, 'Student ID must be at least 5 characters.'),
  bio: z.string().min(10, 'Bio must be at least 10 characters.')
});

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    '.jpg, .jpeg, .png and .webp files are accepted.'
  );
