export const errorMessages = {
    default: 'Something went wrong, please try again later.',
    notFound: (resource?: string) => `${resource || 'Resource'} not found.`,
    auth403: `You do not have the permission to do this action.`,
}

export const globalColors = {
    brand: '#4f46e5',
    red: '#e11d48'
}

type TactionSuccess =
    | 'Logged In'
    | 'Updated'
    | 'Deleted'
    | 'Published'
    | 'Created';

type TactionLoading =
    | 'Updating'
    | 'Deleting'
    | 'Creating';

type TResource = 'Question' | 'Quiz' | 'User'

export const successMessages = {
    actionSuccess: (action: TactionSuccess, resource?: TResource) =>
        `Successfully ${action} ${resource || 'resource'}`,
}

export const loadingMessages = {
    actionLoading: (action: TactionLoading, resource?: TResource) =>
        `${action} ${resource || 'resource'}`,
}

export const emptyResponseMessages = {
    attempt: ['You have not attempted any quizes yet.'],
    responses: ["You can only see responses to first attempt at any quiz."],
    dashboardQuizes: ['You have not created any quizes yet.'],
    quizQuestions: ['This quiz have no questions.'],
    mainQuizes: ['There are no active Quizzes at the moment.', 'Go ahead make a Quiz.'],
    filteredQuizes: ['No active Quizzes found with the given filters.'],
}

export const uiMessages = {
    allowedMarkingACorrectOption: ['* Please mark atleast one answer correct, multiple answers can also be marked correct.'],
    warnQuestionCreate: ['Note: A question can not be edited when the associated Quiz is Published']
}

export const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    bgcolor: '#ffffff',
    overflow: 'auto',
    boxShadow: 24,
    padding: '1rem 2rem',
    border: 0,
    borderRadius: '6px',
};
