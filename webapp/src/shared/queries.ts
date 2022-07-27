import axios, { AxiosError, AxiosResponse } from "axios";
import { MutationOptions, QueryKey, useMutation, useQuery, UseQueryOptions } from "react-query";
import { endpoints } from "./urls";

export const PublicQueryFactory = (queryKey: QueryKey, url: string, options?: UseQueryOptions<any, AxiosError, any>) => {

    return useQuery<any, AxiosError, any>(
        queryKey,
        async () => {
            return axios({
                url,
                method: 'GET',
            }).then(
                (result: AxiosResponse) => result.data
            )
        }, {
        refetchOnWindowFocus: false,
        retry: false,
        ...options
    }
    )
}

export const QueryFactory = (queryKey: QueryKey, url: string, options?: UseQueryOptions<any, AxiosError, any>) => {
    return useQuery<any, AxiosError, any>(
        queryKey,
        async () => {
            const user = JSON.parse(localStorage.getItem('user') ?? 'null');
            const token = user?.token;
            return axios({
                url,
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            }).then(
                (result: AxiosResponse) => result.data
            )
        }, {
        refetchOnWindowFocus: false,
        retry: false,
        ...options
    }
    )
}

const PublicMutationFactory = (mutationKey: QueryKey, url: string, method: 'POST' | 'PUT' | 'PATCH', options?: MutationOptions) => {
    return useMutation<any, AxiosError, any>({
        mutationKey,
        mutationFn: async (variables: { body: any }) => {
            return axios({
                url,
                method,
                data: variables.body
            }).then(
                (response: AxiosResponse) => response.data
            )
        },
        ...options
    })

}

const MutationFactory = (mutationKey: QueryKey, url: string, method: 'POST' | 'PUT' | 'PATCH', options?: MutationOptions) => {
    return useMutation<any, AxiosError, any>({
        mutationKey,
        mutationFn: async (variables: { body: any }) => {
            const user = JSON.parse(localStorage.getItem('user') ?? 'null');
            const token = user?.token;
            return axios({
                url,
                method,
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                data: variables.body
            }).then(
                (response: AxiosResponse) => response.data
            )
        },
        ...options
    })

}

const DeleteMutationFactory = (mutationKey: QueryKey, url: string, options?: MutationOptions) => {
    return useMutation<any, AxiosError, any>({
        mutationKey,
        mutationFn: async () => {
            const user = JSON.parse(localStorage.getItem('user') ?? 'null');
            const token = user?.token;
            return axios({
                url,
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            }).then(
                (response: AxiosResponse) => response.data
            )
        },
        ...options
    })

}


export const useQuizes = (url: string, queryKey: QueryKey, options?: UseQueryOptions<any, AxiosError, any>) => QueryFactory(queryKey, url, options);
export const useQuiz = (id: string, options?: UseQueryOptions<any, AxiosError, any>) => QueryFactory(['Quiz', id], endpoints.quizById(id), options);
export const useQuizQuestions = (id: string, options?: UseQueryOptions<any, AxiosError, any>) => QueryFactory(['Quiz Questions', id], endpoints.quizQuestions(id), options);
export const useQuizQuestion = (quizId: string, questionId: string, options?: UseQueryOptions<any, AxiosError, any>) => QueryFactory(['Quiz Question', quizId, questionId], endpoints.quizQuestionById(quizId, questionId), options);
export const useQuizPlay = (id: string, options?: UseQueryOptions<any, AxiosError, any>) => PublicQueryFactory(['Quiz Play', id], endpoints.quizPlay(id), options);
export const useQuizResult = (id: string, options?: MutationOptions) => PublicMutationFactory(['Quiz Result', id], endpoints.quizResult(id), "POST", options);

export const useCreateQuiz = (options?: MutationOptions) => MutationFactory('Create Quiz', endpoints.quizzes, 'POST', options)
export const useCreateQuestion = (id: string, options?: MutationOptions) => MutationFactory('Create Question', endpoints.quizQuestions(id), 'POST', options)

export const useUpdateQuiz = (id: string, options?: MutationOptions) => MutationFactory('Update Quiz', endpoints.quizzes + id, 'PATCH', options)
export const useUpdateQuestion = (quizId: string, questionId: string, options?: MutationOptions) => MutationFactory('Update Question', endpoints.quizQuestionById(quizId, questionId), 'PATCH', options)

export const usePublishQuiz = (id: string, options?: MutationOptions) => MutationFactory('Publish Quiz', endpoints.quizzes + id + '/publish', 'PATCH', options)

export const useDeleteQuestion = (quizId: string, questionId: string, options?: MutationOptions) => DeleteMutationFactory('Delete Question', endpoints.quizQuestionById(quizId, questionId), options)
export const useDeleteQuiz = (quizId: string, options?: MutationOptions) => DeleteMutationFactory('Delete Question', endpoints.quizById(quizId), options)

export const useSignup = (options?: MutationOptions) => MutationFactory('Signup User', endpoints.signup, 'POST', options)
export const useLogin = (options?: MutationOptions) => MutationFactory('Login User', endpoints.login, 'POST', options)
export const useProfile = (options?: UseQueryOptions<any, AxiosError, any>) => QueryFactory('Get User Profile', endpoints.login, options)
export const useUpdateProfile = (options?: MutationOptions) => MutationFactory('Update User Profile', endpoints.profile, 'PUT', options)