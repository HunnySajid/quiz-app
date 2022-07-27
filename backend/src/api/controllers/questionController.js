import asyncHandler from 'express-async-handler';
import { Question } from '../../models/Question.js';
import { Quiz } from '../../models/Quiz.js';
import { emptyResponseMessages, errorMessages } from '../../shared/constants.js';
import { AppError } from '../../utils/AppError.js';

// @desc Create a Question
// @route POST /:quizId/questions/
// @access PRIVATE
const createQuestion = asyncHandler(async (req, res) => {
	const { quizId } = req.params;
	const { title, options } = req.body;

	if (!title || !options) {
		throw new AppError('Please send Quiz, title, options array', 400);
	}

	options.forEach((option) => {
		if (!option.text) {
			throw new AppError('Please send all option with a text key in it.');
		}
	});

	if (!(options.length >= 2 && options.length <= 5)) {
		throw new AppError('Options length should be between 2-5.');
	}

	if (!(options.filter((option) => option.correct).length >= 1)) {
		throw new AppError('Options must have atleast 1 correct option');
	}

	const quiz = await Quiz.findById(quizId).populate('questionsCount');

	if (!quiz) {
		throw new AppError("Cannot add questions to a quiz that doesn't exist", 404);
	}

	if (quiz.questionsCount > 9) {
		throw new AppError('A Quiz cannot have more that 10 questions.', 409);
	}

	const question = await Question.create({
		quiz: quizId,
		author: req.user._id,
		title,
		options
	});

	return res.status(200).json({
		status: 'success',
		question
	});
});

// @desc Fetch all Questions
// @route GET /:quizId/questions/
// @access PRIVATE
const getAllQuestion = asyncHandler(async (req, res) => {
	const { quizId } = req.params;
	const quiz = await Quiz.findById(quizId);
	const questions = await Question.find({ quiz: quizId }).select('-options.correct');

	if (!quiz) {
		throw new AppError('Quiz not found.', 404);
	}

	if (quiz.status !== 'active') {
		const isLoggedInUserAuthor = req.user._id.equals(quiz.author);
		if (!isLoggedInUserAuthor) {
			throw new AppError('You do not have permission to access this quiz.', 403);
		}
	}

	return res.status(200).json({
		status: 'success',
		questions,
		quizTitle: quiz.title,
		author: quiz.author
	});
});

// @desc Get a Question
// @route GET /:quizId/questions/:questionId
// @access PRIVATE
const getQuestion = asyncHandler(async (req, res) => {
	const { quizId, questionId } = req.params;

	const question = await Question.findOne({ _id: questionId, quiz: quizId });

	if (!question) {
		throw new AppError(emptyResponseMessages.NO_QUESTIONS_IN_QUIZ, 404);
	}
	return res.status(200).json({
		status: 'success',
		question
	});
});

// @desc Update a question
// @route PATCH /:quizId/questions/:questionId
// @access PRIVATE
const updateQuestion = asyncHandler(async (req, res) => {
	const { quizId, questionId } = req.params;
	const { title, options } = req.body;

	const questiontoUpdate = await Question.findOne({ _id: questionId, quiz: quizId });

	if (!questiontoUpdate) {
		throw new AppError(errorMessages.RESOURCE_DOES_NOT_EXIST('Question'), 404);
	}

	if (title) {
		questiontoUpdate.title = title;
	}

	if (options) {
		options.forEach((option) => {
			if (!option.text) {
				throw new AppError('Please send all option with a text key in it.');
			}
		});

		if (!(options.length >= 2 && options.length <= 5)) {
			throw new AppError('Options length should be between 2-5.');
		}

		if (!(options.filter((option) => option.correct).length >= 1)) {
			throw new AppError('Options must have atleast 1 correct option');
		}
		questiontoUpdate.options = options;
	}

	await questiontoUpdate.save();

	return res.status(200).json({
		status: 'success',
		question: questiontoUpdate
	});
});

// @desc Delete a Question
// @route DELETE /:quizId/questions/:questionId
// @access PRIVATE
const deleteQuestion = asyncHandler(async (req, res) => {
	const { quizId, questionId } = req.params;

	const question = await Question.findOneAndDelete({ _id: questionId, quiz: quizId });

	if (!question) {
		throw new AppError("Question you are trying to delete doesn't exist.", 404);
	}

	return res.status(204).json({
		status: 'success'
	});
});

export { createQuestion, getAllQuestion, getQuestion, updateQuestion, deleteQuestion };
