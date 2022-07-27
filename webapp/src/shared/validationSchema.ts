import * as Yup from 'yup';

export const SignupUserValidation = Yup.object().shape({
    name: Yup.string().required('Name is required.').max(50, 'Not more than 50 characters'),
    password: Yup.string().required('Password is required.')
        .min(6, 'At least 6 characters')
        .max(30, 'Not More than 30 characters'),
    email: Yup.string().email().required('Email is required'),
});

export const LoginUserValidation = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').required('Email is required'),
    password: Yup.string().required('Password is required.')
});

export const AddEditQuizValidation = Yup.object().shape({
    title: Yup.string().required('Title is required.'),
    description: Yup.string().required('Description is required.'),
    tags: Yup.array().of(Yup.string()),
});

export const AddEditQuestionValidation = Yup.object().shape({
    title: Yup.string().required('Title is required.'),
    options: Yup.array().of(
        Yup.object().shape({
            text: Yup.string().required('Required.'),
            correct: Yup.bool()
        })
    ),
})

export const FiltersValidation = Yup.object().shape({
    search: Yup.string().nullable(),
    tags: Yup.string().nullable(),
})