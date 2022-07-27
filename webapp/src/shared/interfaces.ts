export interface IQuestionForm {
    title: string;
    options: IOption[];
}
export interface IQuestion {
    _id: string;
    quiz: string; // unpopulated
    title: string;
    options: IOption[];
    hasMultiCorrect?: boolean;
}

export interface IOption {
    text: string;
    correct?: boolean;
    _id?: string;
}

export interface IOptionWithFrequency extends IOption {
    frequency: number
}

export interface IResponse extends IQuestion {
    response: number[];
}


export interface IQuizForm {
    title: string;
    description: string;
    tags: string[];
    status?: string;
}

export interface IQuiz extends IQuizForm {
    status: string;
    _id: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    id: string;
    attemptsCount: number;
    questionsCount: number;
    permalink?: string;
}

export interface IAuthForm {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}