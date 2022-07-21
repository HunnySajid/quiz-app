import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { globalErrorHandler } from '../api/controllers/errorController.js';
import { AppError } from '../utils/AppError.js';

export const initExpress = ({ app }) => {
	app.use(helmet());
	// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// It shows the real origin IP in the heroku or Cloudwatch logs
	app.enable('trust proxy');
	// Enable Cross Origin Resource Sharing to all origins by default
	if (process.env.NODE_ENV === 'production') {
		app.use(cors({ origin: 'https://quizco-app.netlify.app' }));
	} else {
		app.use(cors());
	}

	// Middleware that transforms the raw string of req.body into json
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.get('/', (req, res) => res.send('API is running'));

	// all runs for all http methods
	app.all('*', (req, res, next) => {
		next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
	});

	app.use(globalErrorHandler);
};
