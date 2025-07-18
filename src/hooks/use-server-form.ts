import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

type ServerFormOptions<T extends z.ZodType<any, any>> = {
  schema: T;
  defaultValues?: z.infer<T>;
  action: (
    values: z.infer<T>
  ) => Promise<{ success: boolean; message: string; errors?: any }>;
  onSuccess?: (result: {
    success: boolean;
    message: string;
    errors?: any;
  }) => void;
};

export function useServerForm<T extends z.ZodType<any, any>>({
  schema,
  defaultValues,
  action,
  onSuccess
}: ServerFormOptions<T>) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const onSubmit = async (values: z.infer<T>) => {
    startTransition(async () => {
      try {
        const result = await action(values);

        if (result.success) {
          toast.success(result.message);
          if (onSuccess) {
            onSuccess(result);
          }
        } else {
          if (result.errors) {
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
      }
    });
  };

  return { form, onSubmit, isPending };
}
