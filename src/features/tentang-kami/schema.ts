import * as z from 'zod';

export const tentangKamiSchema = z.object({
  hero_title: z.string().min(1, 'Hero title is required.'),
  hero_description: z
    .string()
    .min(10, 'Hero description must be at least 10 characters.'),

  about_title: z.string().min(1, 'About title is required.'),
  about_description: z
    .string()
    .min(10, 'About description must be at least 10 characters.'),

  objectives_title: z.string().min(1, 'Objectives title is required.'),
  objectives_description: z
    .string()
    .min(10, 'Objectives description must be at least 10 characters.'),
  objectives: z
    .array(z.string().min(1, 'Objective cannot be empty.'))
    .min(1, 'At least one objective is required.'),

  video_title: z.string().min(1, 'Video title is required.'),
  video_url: z.string().url('Please enter a valid YouTube URL.')
});

export type TentangKamiFormValues = z.infer<typeof tentangKamiSchema>;
