import mongoose from 'mongoose';

const quizSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Quiz title required']
		},
		description: {
			type: String
		},
		tags: [
			{
				type: String
			}
		],
		status: {
			type: String,
			default: 'draft',
			enum: ['draft', 'active', 'inactive']
		},
		deleted: {
			type: Boolean,
			default: false,
			select: false
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'A quiz needs an author.']
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true
	}
);

quizSchema.virtual('questions', {
	ref: 'Question',
	foreignField: 'quiz',
	localField: '_id'
});

quizSchema.virtual('questionsCount', {
	ref: 'Question',
	foreignField: 'quiz',
	localField: '_id',
	count: true
});

export const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
