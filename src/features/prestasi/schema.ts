import * as z from 'zod';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const prestasiSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  team_name: z.string().min(2, 'Team name must be at least 2 characters.'),
  members: z.array(z.string()).min(1, 'At least one member is required.'),
  category: z.string().min(2, 'Category must be at least 2 characters.'),
  award: z.string().min(2, 'Award must be at least 2 characters.'),
  year: z.string().min(4, 'Year is required.'),
  image_url: z.any().optional()
});

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    '.jpg, .jpeg, .png and .webp files are accepted.'
  );
