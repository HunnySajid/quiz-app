import { response } from 'express';
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
// @route PATCH /quizzes/:quizId/publish
// @access PRIVATE
const publishQuiz = asyncHandler(async (req, res, next) => {
	const { quizId } = req.params;

	const quiz = await Quiz.findById(quizId);

	if (!quiz) {
		res.status(404);
		throw new Error('Quiz does not exist');
	}

	if (quiz.status === 'active') {
		res.status(401);
		throw new Error('Quiz is already published');
	}

	if (quiz.deleted) {
		res.status(403);
		throw new Error('Quiz is inactivated');
	}
	quiz.status = 'active';
	// TODO: need an advance way to assign permalink, need to check if it is not already associated with some published quiz
	quiz.permalink = Math.random().toString(36).substr(2, 6);

	const updatedQuiz = await quiz.save({ new: true, runValidators: true });

	return res.status(200).json({
		status: 'success',
		quiz: updatedQuiz
	});
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

// @desc Fetch a Quiz to play
// @route GET /quizzes/:permalink/play
// @access PRIVATE
const getQuizToPlay = asyncHandler(async (req, res) => {
	const { permalink } = req.params;

	const quiz = await Quiz.findOne({ permalink })
		.populate({
			path: 'questions',
			select: '-options.correct'
		})
		.populate('questionsCount');

	if (!quiz) {
		res.status(404);
		throw new Error('Quiz not found.');
	}

	return res.status(200).json({
		status: 'success',
		questions: quiz.questions,
		quizTitle: quiz.title,
		author: quiz.author,
		quizId: quiz.id
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

// @desc Post results of a quiz
// @route POST /quizzes/:quizId/play/result
// @access PUBLIC
const getQuizResult = asyncHandler(async (req, res, next) => {
	const { quizId } = req.params;
	const { answers } = req.body;

	const quiz = await Quiz.findById(quizId).populate('questions questionsCount');

	if (!quiz) {
		res.status(404);
		throw new Error('Quiz does not exist');
	}

	if (quiz.status !== 'active') {
		res.status(401);
		throw new Error('Quiz is not published');
	}

	if (quiz.deleted) {
		res.status(403);
		throw new Error('Quiz is inactivated');
	}

	let correctCount = 0;
	quiz.questions.forEach((question, index) => {
		let answer = answers[index].response;
		answer = answer.sort().join('');

		const correctAnswer = question.options
			.map((op, ind) => ind + 1)
			.filter((op) => question.options[op - 1].correct)
			.sort()
			.join('');

		if (answer === correctAnswer) {
			correctCount++;
		}
	});

	return res.status(200).json({
		status: 'success',
		total: quiz.questions.length,
		correct: correctCount
	});
});

export {
	createQuiz,
	getQuizToPlay,
	updateQuiz,
	publishQuiz,
	getQuiz,
	deleteQuiz,
	getAllQuizzes,
	getQuizResult
};
