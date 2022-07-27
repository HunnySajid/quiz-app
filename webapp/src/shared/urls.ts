export const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/v1' : 'PROD/api/v1';


export const endpoints = {
    signup: `${baseURL}/users/`,
    login: `${baseURL}/users/login`,
    profile: `${baseURL}/users/profile`,
    quizzes: `${baseURL}/quizzes/`,
    quizById: (id: string) => `${baseURL}/quizzes/${id}/`,
    quizQuestions: (id: string) => `${baseURL}/quizzes/${id}/questions`,
    quizPlay: (id: string) => `${baseURL}/quizzes/${id}/play`,
    quizResult: (id: string) => `${baseURL}/quizzes/${id}/play/result`,
    quizQuestionById: (quizId: string, questionId: string) => `${baseURL}/quizzes/${quizId}/questions/${questionId}`,
}