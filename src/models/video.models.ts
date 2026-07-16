import mongoose from 'mongoose';
import { IVideo } from '../types/video.types.ts';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new mongoose.Schema<IVideo>(
  {
    videoFile: {
      type: String,
      required: [true, 'Video file is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model<IVideo>('Video', videoSchema);
