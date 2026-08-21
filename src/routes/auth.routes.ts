import { Router } from 'express';
import userControllers from '../controllers/user.controller.ts';
import upload from '../middlewares/multer.middleware.ts';
import { verifyJWT } from '../middlewares/auth.middleware.ts';

const authRouter = Router();

authRouter.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  userControllers.registerUser
);
authRouter.post('/login', userControllers.loginUser);
authRouter.post('/logout', verifyJWT, userControllers.logOutUser);

export default authRouter;
