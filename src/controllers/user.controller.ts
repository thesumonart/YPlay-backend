import fs from 'fs';
import ApiError from '../utils/ApiError.ts';
import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';
import userService from '../services/user.service.ts';
import { createUserBody } from '../types/user.types.ts';

const userControllers = {
  registerUser: asyncHandler(async (req, res) => {
    const reqBody = req.body as createUserBody;
    const files = req.files as Record<string, Express.Multer.File[]>;

    const avatarLocalPath = files?.avatar?.[0]?.path;
    const coverImageLocalPath = files?.coverImage?.[0]?.path;

    const cleanupLocalFiles = () => {
      if (avatarLocalPath) fs.existsSync(avatarLocalPath) && fs.unlinkSync(avatarLocalPath);
      if (coverImageLocalPath) fs.existsSync(coverImageLocalPath) && fs.unlinkSync(coverImageLocalPath);
    };

    const existingEmail = await userService.findByEmail(reqBody.email);
    if (existingEmail) {
      cleanupLocalFiles();
      throw ApiError.conflict('Email is already in use.');
    }

    const existingUsername = await userService.findByUsername(reqBody.username);
    if (existingUsername) {
      cleanupLocalFiles();
      throw ApiError.conflict('Username is already taken.');
    }

    const avatarUpload = avatarLocalPath ? await userService.uploadAvatar(avatarLocalPath) : null;
    const avatar = avatarUpload?.secure_url;

    const coverImageUpload = coverImageLocalPath
      ? await userService.uploadCoverImage(coverImageLocalPath)
      : null;
    const coverImage = coverImageUpload?.secure_url;

    const user = await userService.createUser({
      ...reqBody,
      avatar,
      coverImage,
    });

    if (!user) throw ApiError.internal('Failed to create user.');

    const response = new ApiResponse(201, user, 'User registered successfully');

    res.status(response.statusCode).json(response);
  }),
};

export default userControllers;
