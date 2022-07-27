import asyncHandler from 'express-async-handler';
import { Quiz } from '../../models/Quiz.js';

export const isAuthorInQuiz = asyncHandler(async (req, res, next) => {
	const userId = req.user._id;
	const quiz = await Quiz.findById(req.params.quizId);
	if (!quiz.author.equals(userId)) {
		res.status(403);
		throw new Error('You do not have enough permission to access this resource.');
	}
	next();
});
