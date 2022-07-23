import mongoose from 'mongoose';

const questionSchema = mongoose.Schema(
	{
		quiz: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Quiz',
			required: [true, 'A question has to be associated with a quiz']
		},
		title: {
			type: String,
			required: [true, 'Question title required']
		},
		options: {
			type: [{ _id: false, text: String, correct: Boolean }],
			validate: [
				{ validator: optionsLength, msg: '{PATH} length should be between 2-5' },
				{ validator: oneCorrectOption, msg: '{PATH} must have atleast 1 correct option' }
			],
			required: [true, 'Question options are required']
		},
		hasMultiCorrect: {
			type: Boolean,
			default: false
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true
	}
);

questionSchema.pre('save', async function (next) {
	this.hasMultiCorrect = this.options?.filter((opt) => opt.correct).length > 1;
});

export const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

function optionsLength(val) {
	return val.length >= 2 && val.length <= 5;
}

function oneCorrectOption(opts) {
	const correct = opts.filter((opt) => opt.correct);
	return correct.length >= 1;
}
