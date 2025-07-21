import * as z from 'zod';

export const divisionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  order_index: z
    .number()
    .int()
    .min(0, 'Order index must be a non-negative integer.')
});
