import mongoose, { HydratedDocument } from 'mongoose';

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

export type UserDocument = HydratedDocument<IUser>;
