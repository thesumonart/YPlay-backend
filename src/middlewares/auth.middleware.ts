import jwt from 'jsonwebtoken';
import userService from '../services/user.service.ts';
import ApiError from '../utils/ApiError.ts';
import asyncHandler from '../utils/asyncHandler.ts';
import { Request } from 'express';

export const verifyJWT = asyncHandler(async (req: Request, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as jwt.JwtPayload & { _id: string };
    const user = await userService.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }
    const { password, refreshToken: _, ...loggedInUser } = user.toObject();

    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || 'Invalid Access Token');
  }
});
