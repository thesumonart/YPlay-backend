import { IUser } from './user.types.ts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDocument;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
    interface User extends IUser {}
  }
}
