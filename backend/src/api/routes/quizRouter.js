import express from 'express';
import {
	createQuiz,
	getQuiz,
	updateQuiz,
	deleteQuiz,
	getAllQuizzes,
	publishQuiz,
	getQuizToPlay,
	getQuizResult
} from '../controllers/quizController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAuthorInQuiz } from '../middlewares/isAuthorInQuiz.js';
import questionRouter from './questionRouter.js';
const quizRouter = express.Router();

quizRouter.use('/:quizId/questions', questionRouter);

quizRouter.route('/').get(protect, getAllQuizzes).post(protect, createQuiz);
quizRouter
	.route('/:quizId')
	.get(getQuiz)
	.patch(protect, isAuthorInQuiz, updateQuiz)
	.delete(protect, isAuthorInQuiz, deleteQuiz);

quizRouter.route('/:quizId/publish').patch(protect, isAuthorInQuiz, publishQuiz);
quizRouter.route('/:permalink/play').get(getQuizToPlay);
quizRouter.route('/:quizId/play/result').post(getQuizResult);

export default quizRouter;
