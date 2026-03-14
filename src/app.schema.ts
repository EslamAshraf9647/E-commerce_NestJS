import z from 'zod';

export const AppBodySchema = z
  .object({
    firstName: z
      .string({ message: 'firstName must be a string' })
      .min(3, { message: 'firstName must be at least 3 characters long' })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'firstName must contain at least one letter and one number',
      }),
    lastName: z
      .string({ message: 'lastName must be a string' })
      .min(3, { message: 'lastName must be at least 3 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string({ message: 'password must be a string' })
      .min(8, { message: 'password must be at least 8 characters long' })
      .regex(/(?=.*[a-z])/, {
        message: 'password must contain at least one lowercase letter',
      })
      .regex(/(?=.*[A-Z])/, {
        message: 'password must contain at least one uppercase letter',
      })
      .regex(/(?=.*\d)/, {
        message: 'password must contain at least one number',
      })
      .regex(/(?=.*[@$!%*?&])/, {
        message: 'password must contain at least one special character',
      }),
    ConfirmPassword: z.string(),
    gender: z.enum(['male', 'female', 'other'], {
      message: 'gender must be either male, female, or other',
    }),
    role: z.enum(['user', 'admin'], {
      message: 'role must be either user or admin',
    }),
  })
  .strict()
  .refine((data) => data.password === data.ConfirmPassword, {
    message: 'Passwords do not match',
  });

export type AppBodyType = z.infer<typeof AppBodySchema>;
