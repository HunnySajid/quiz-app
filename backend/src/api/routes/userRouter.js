import express from 'express';
import {
	authUser,
	getUserProfile,
	registerUser,
	updateUserProfile
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
const userRouter = express.Router();

userRouter.route('/').post(registerUser);
userRouter.post('/login', authUser);
userRouter.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default userRouter;
