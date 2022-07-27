import asyncHandler from 'express-async-handler';
import { Quiz } from '../../models/Quiz.js';
import { AppError } from '../../utils/AppError.js';

// @desc Create a Quiz
// @route POST /quizzes
// @access PRIVATE
const createQuiz = asyncHandler(async (req, res) => {
	const { title, description, tags } = req.body;

	const author = req.user._id;

	if (!title) {
		throw new AppError('Please send Quiz title.', 400);
	}

	if (!author) {
		throw new AppError('Author not found.', 400);
	}

	if (tags && !Array.isArray(tags)) {
		throw new AppError('Please send tags as array.', 400);
	}

	if (tags && !(tags.length >= 1)) {
		throw new AppError('Please send at least 1 tag in array.', 400);
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

	if (tags) {
		if (!Array.isArray(tags)) {
			throw new AppError('Please send tags as array.', 400);
		}
	}
	const quiz = await Quiz.findById(quizId);

	if (title) {
		quiz.title = title;
	}

	if (description) {
		quiz.description = description;
	}

	if (tags) {
		if (!(tags.length >= 1)) {
			quiz.tags = null;
		} else {
			quiz.tags = tags;
		}
	}

	if (quiz.status === 'active') {
		throw new AppError('Can not edit a published Quiz', 401);
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

	const quiz = await Quiz.findById(quizId).populate('questionsCount');

	if (!quiz) {
		throw new AppError('Quiz does not exist', 404);
	}

	if (quiz.status === 'active') {
		throw new AppError('Quiz is already published', 401);
	}

	if (quiz.deleted) {
		throw new AppError('Quiz is inactivated', 403);
	}

	if (quiz.questionsCount < 1) {
		throw new AppError('Quiz does not have any questions associated', 403);
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
		throw new AppError('Quiz not found', 404);
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
		throw new AppError('Quiz not found.', 404);
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
		throw new AppError("Quiz you are trying to delete doesn't exist.", 404);
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
		throw new AppError('Quiz does not exist', 404);
	}

	if (quiz.status !== 'active') {
		throw new AppError('Quiz is not published', 401);
	}

	if (quiz.deleted) {
		throw new AppError('Quiz is inactivated', 403);
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
