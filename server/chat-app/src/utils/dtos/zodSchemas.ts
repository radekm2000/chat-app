import { z } from 'zod';

export const ChangePasswordDtoSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: `Passwords dont match`,
  });

export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>;
