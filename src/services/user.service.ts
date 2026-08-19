import { User } from '../models/user.models.ts';
import cloudinaryUploader from '../utils/cloudinary.ts';
import { IUser } from '../types/user.types.ts';

const userService = {
  findByEmail: async (email: string) => {
    return User.findOne({ email });
  },

  findByUsername: async (username: string) => {
    return User.findOne({ username });
  },

  findById: async (userId: string) => {
    return User.findById({ userId });
  },

  uploadAvatar: async (localPath: string) => {
    return cloudinaryUploader(localPath);
  },

  uploadCoverImage: async (localPath: string) => {
    return cloudinaryUploader(localPath);
  },

  createUser: async (
    data: Pick<IUser, 'username' | 'email' | 'fullName' | 'password' | 'avatar' | 'coverImage'>
  ) => {
    const user = await User.create(data);
    return User.findById(user._id).select('-password -refreshToken');
  },
};

export default userService;
