import express from 'express';
import {
	createQuestion,
	getAllQuestion,
	getQuestion,
	updateQuestion,
	deleteQuestion
} from '../controllers/questionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAuthorInQuiz } from '../middlewares/isAuthorInQuiz.js';

const questionRouter = express.Router({ mergeParams: true });

questionRouter.route('/').get(protect, getAllQuestion).post(protect, createQuestion);
questionRouter.route('/:questionId').get(getQuestion);

questionRouter.use(protect);
questionRouter.use(isAuthorInQuiz);
questionRouter.route('/:questionId').patch(updateQuestion).delete(deleteQuestion);

export default questionRouter;
