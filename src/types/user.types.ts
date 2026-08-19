import mongoose, { HydratedDocument } from 'mongoose';
import z from 'zod';
import { createUserSchema } from '../validations/user.validation.ts';

export interface IUser {
  username: string;
  email: string;
  fullName: string;
  password: string;
  avatar?: string;
  coverImage?: string;
  watchHistory?: mongoose.Types.ObjectId[];
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

export type createUserBody = z.infer<typeof createUserSchema.body>;
