import { z } from 'zod';

export const RegisterDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(2).max(100),
  address: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
});

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ChangePasswordDtoSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100),
});

export const UpdateProfileDtoSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  address: z.string().max(500).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
export type LoginDto = z.infer<typeof LoginDtoSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;
