import mongoose, { HydratedDocument } from 'mongoose';

export interface IVideo {
  videoFile: string;
  thumbnail: string;
  owner: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type VideoDocument = HydratedDocument<IVideo>;
