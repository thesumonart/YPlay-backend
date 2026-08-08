import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded } from 'express';
import { errorHandler, notFoundHandler } from './utils/errorHandlers.ts';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: '16kb',
  })
);

app.use(
  urlencoded({
    extended: true,
    limit: '16kb',
  })
);

app.use(express.static('public'));
app.use(cookieParser());

// Routes import
import authRouter from './routes/auth.routes.ts';

// Routes declaration
app.use('/api/v1/auth', authRouter);

// error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
