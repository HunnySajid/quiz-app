import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { globalErrorHandler } from '../api/controllers/errorController.js';
import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import userRoutes from '../api/routes/userRouter.js';
import quizRoutes from '../api/routes/quizRouter.js';

export const initExpress = ({ app }) => {
	app.use(helmet());
	// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// It shows the real origin IP in the heroku or Cloudwatch logs
	app.enable('trust proxy');
	// Enable Cross Origin Resource Sharing to all origins by default
	if (process.env.NODE_ENV === 'production') {
		app.use(cors({ origin: process.env.BASE_URL }));
	} else {
		app.use(cors());
	}

	// Middleware that transforms the raw string of req.body into json
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.get('/', (req, res) => res.send('API is running'));
	app.use(`${config.api.prefix}/users`, userRoutes);
	app.use(`${config.api.prefix}/quizzes`, quizRoutes);

	// all runs for all http methods
	app.all('*', (req, res, next) => {
		next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
	});

	app.use(globalErrorHandler);
};
