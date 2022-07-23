import asyncHandler from 'express-async-handler';
import { Question } from '../../models/Question.js';
import { Quiz } from '../../models/Quiz.js';
import { emptyResponseMessages, errorMessages } from '../../shared/constants.js';

// @desc Create a Question
// @route POST /:quizId/questions/
// @access PRIVATE
const createQuestion = asyncHandler(async (req, res) => {
	const { quizId } = req.params;
	const { title, options } = req.body;

	if (!title || !options) {
		res.status(400);
		throw new Error('Please send Quiz, title, options array');
	}

	options.forEach((option) => {
		if (!option.text) {
			throw new Error('Please send all option with a text key in it.');
		}
	});

	if (!(options.length >= 2 && options.length <= 5)) {
		throw new Error('Options length should be between 2-5.');
	}

	if (!(options.filter((option) => option.correct).length >= 1)) {
		throw new Error('Options must have atleast 1 correct option');
	}

	const quiz = await Quiz.findById(quizId).populate('questionsCount');

	if (!quiz) {
		res.status(404);
		throw new Error("Cannot add questions to a quiz that doesn't exist");
	}

	if (quiz.questionsCount > 9) {
		res.status(409);
		throw new Error('A Quiz cannot have more that 10 questions.');
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
	const questions = await Question.find({ quiz: quizId });

	if (!quiz) {
		res.status(404);
		throw new Error('Quiz not found.');
	}

	if (quiz.status !== 'active') {
		const isLoggedInUserAuthor = req.user._id.equals(quiz.author);
		if (!isLoggedInUserAuthor) {
			res.status(403);
			throw new Error('You do not have permission to access this quiz.');
		}
	}

	return res.status(200).json({
		status: 'success',
		questions,
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
		res.status(404);
		throw new Error(emptyResponseMessages.NO_QUESTIONS_IN_QUIZ);
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
		res.status(404);
		throw new Error(errorMessages.RESOURCE_DOES_NOT_EXIST('Question'));
	}

	if (title) {
		questiontoUpdate.title = title;
	}

	if (options) {
		options.forEach((option) => {
			if (!option.text) {
				throw new Error('Please send all option with a text key in it.');
			}
		});

		if (!(options.length >= 2 && options.length <= 5)) {
			throw new Error('Options length should be between 2-5.');
		}

		if (!(options.filter((option) => option.correct).length >= 1)) {
			throw new Error('Options must have atleast 1 correct option');
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
		res.status(404);
		throw new Error("Question you are trying to delete doesn't exist.");
	}

	return res.status(204).json({
		status: 'success'
	});
});

export { createQuestion, getAllQuestion, getQuestion, updateQuestion, deleteQuestion };
