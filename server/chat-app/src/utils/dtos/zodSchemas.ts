import { z } from 'zod';

export const ChangePasswordDtoSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
    token: z.string(),
    userId: z.number(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: `Passwords dont match`,
  });

export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>;

export const CreateFriendRequestSchema = z.object({
  username: z.string(),
  userId: z.number(),
});

export type CreateFriendRequestDto = z.infer<typeof CreateFriendRequestSchema>;
