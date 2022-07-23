import asyncHandler from 'express-async-handler';
import { Quiz } from '../../models/Quiz.js';

// @desc Create a Quiz
// @route POST /quizzes
// @access PRIVATE
const createQuiz = asyncHandler(async (req, res) => {
	const { title, description, tags } = req.body;

	const author = req.user._id;

	if (!title) {
		res.status(400);
		throw new Error('Please send Quiz title.');
	}

	if (!author) {
		res.status(400);
		throw new Error('Author not found.');
	}

	if (tags && !Array.isArray(tags)) {
		res.status(400);
		throw new Error('Please send tags as array.');
	}

	if (tags && !(tags.length >= 1)) {
		res.status(400);
		throw new Error('Please send at least 1 tag in array.');
	}

	const quiz = await Quiz.create({
		title,
		description,
		tags,
		author
	});

	return res.status(200).json({
		status: 'success',
		quiz: quiz
	});
});

// @desc Update a Quiz
// @route PATCH /quizzes/:quizId
// @access PRIVATE
const updateQuiz = asyncHandler(async (req, res) => {
	const { title, description, tags } = req.body;
	const { quizId } = req.params;
	const toUpdateData = {};

	if (tags) {
		if (!Array.isArray(tags)) {
			res.status(400);
			throw new Error('Please send tags as array.');
		}
		if (!(tags.length >= 1)) {
			res.status(400);
			throw new Error('Please send at least 1 tag.');
		}
		toUpdateData.tags = tags;
	}
	const quiz = await Quiz.findById(quizId);

	if (title) {
		quiz.title = title;
	}

	if (description) {
		quiz.description = description;
	}

	if (toUpdateData.tags) {
		quiz.tags = toUpdateData.tags;
	}

	if (quiz.status === 'active') {
		res.status(401);
		throw new Error('Can not edit a published Quiz');
	}
	const updatedQuiz = await quiz.save({ new: true, runValidators: true });

	return res.status(200).json({
		status: 'success',
		quiz: updatedQuiz
	});
});

// @desc Publish a Quiz
// @route PATCH /quizzes/:quizId
// @access PRIVATE
const publishQuiz = asyncHandler(async (req, res, next) => {
	// TODO
});

// @desc Fetch all Quizzes
// @route GET /quizzes
// @access PRIVATE
const getAllQuizzes = asyncHandler(async (req, res) => {
	const quizzes = await Quiz.find({ author: req.user._id }).populate('questionsCount');
	const count = await Quiz.countDocuments({ author: req.user._id });
	return res.status(200).json({
		status: 'success',
		quizzes,
		count
	});
});

// @desc Fetch a Quiz
// @route GET /quizzes/:quizId
// @access PRIVATE
const getQuiz = asyncHandler(async (req, res) => {
	const { quizId } = req.params;

	const quiz = await Quiz.findById(quizId)
		.populate({
			path: 'questions',
			select: '-options.correct'
		})
		.populate('questionsCount');

	if (!quiz) {
		res.status(404);
		throw new Error('Quiz not found');
	}

	return res.status(200).json({
		status: 'success',
		quiz: quiz
	});
});

const deleteQuiz = asyncHandler(async (req, res) => {
	const { quizId } = req.params;
	const quiz = await Quiz.findOneAndUpdate({ _id: quizId }, { deleted: true });

	if (!quiz) {
		res.status(404);
		throw new Error("Quiz you are trying to delete doesn't exist.");
	}

	return res.status(204).json({
		status: 'success'
	});
});

export { createQuiz, updateQuiz, publishQuiz, getQuiz, deleteQuiz, getAllQuizzes };
