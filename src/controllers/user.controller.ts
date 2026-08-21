import fs from 'fs';
import ApiError from '../utils/ApiError.ts';
import ApiResponse from '../utils/ApiResponse.ts';
import asyncHandler from '../utils/asyncHandler.ts';
import userService from '../services/user.service.ts';
import { createUserBody } from '../types/user.types.ts';
import { Types } from 'mongoose';

const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
  try {
    const user = await userService.findById(userId.toString());

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token generation error:', error);
    throw new ApiError(500, 'Something went wrong while generating Access and Refresh token');
  }
};

const userControllers = {
  registerUser: asyncHandler(async (req, res) => {
    const reqBody = req.body as createUserBody;
    const files = req.files as Record<string, Express.Multer.File[]>;

    const avatarLocalPath = files?.avatar?.[0]?.path;
    const coverImageLocalPath = files?.coverImage?.[0]?.path;

    const cleanupLocalFiles = () => {
      if (avatarLocalPath) fs.existsSync(avatarLocalPath) && fs.unlinkSync(avatarLocalPath);
      if (coverImageLocalPath)
        fs.existsSync(coverImageLocalPath) && fs.unlinkSync(coverImageLocalPath);
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
  loginUser: asyncHandler(async (req, res) => {
    const reqBody = req.body;

    if (!reqBody?.username && !reqBody?.email) {
      throw new ApiError(400, 'Username or email is required');
    }

    const user =
      (await userService.findByUsername(reqBody?.username)) ||
      (await userService.findByEmail(reqBody?.email));

    if (!user) {
      throw new ApiError(404, 'User does not exists.');
    }

    const isPasswordValid = await user.isPasswordCorrect(reqBody.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const { password, refreshToken: _, ...loggedInUser } = user.toObject();

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          'User logged In successfully.'
        )
      );
  }),
  logOutUser: asyncHandler(async (req, res) => {
    const user = userService.updateUser(req.user?._id, { refreshToken: undefined });
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(new ApiResponse(200, null, 'Logged out successfully.'));
  }),
};

export default userControllers;
