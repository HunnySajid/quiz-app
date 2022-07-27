import asyncHandler from 'express-async-handler';
import User from '../../models/User.js';
import generateToken from '../../utils/GenerateToken.js';
import { AppError } from '../../utils/AppError.js';

// @desc Register a new User
// @route POST /users
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const userExists = await User.findOne({ email });

	if (userExists) {
		throw new AppError('user already exists', 400);
	}

	const user = await User.create({
		name,
		email,
		password
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id)
		});
	} else {
		throw new AppError('Invalid user data', 400);
	}
});

// @desc Auth user and get token
// @route POST /users/login
// @access PUBLIC
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id)
		});
	} else {
		throw new AppError('invalid email or password', 401);
	}
});

// @desc Auth user profile
// @route GET /users/profile
// @access PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	if (user) {
		res.json({
			_id: user._id,
			email: user.email,
			name: user.name
		});
	} else {
		throw new AppError('User not found', 404);
	}
});

// @desc Updates user profile
// @route UPDATE /api/users/profile
// @access PRIVATE
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			token: generateToken(updatedUser._id)
		});
	} else {
		throw new AppError('User not found', 404);
	}
});

export { registerUser, authUser, getUserProfile, updateUserProfile };
