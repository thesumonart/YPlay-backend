import z from 'zod';

export const createUserSchema = {
  body: z.object({
    username: z
      .string()
      .min(5, { error: 'Minimum 5 character required.' })
      .max(16, { error: 'Maximum 16 character allowed.' }),
    email: z.email(),
    fullName: z
      .string()
      .min(5, { error: 'Minimum 5 character required.' })
      .max(64, { error: 'Maximum 64 character allowed.' }),
    password: z
      .string()
      .min(8, { error: 'Minimum 8 character required.' })
      .max(24, { error: 'Maximum 24 character allowed.' }),
    avatar: z.string().optional(),
    coverImage: z.string().optional(),
  }),
};
