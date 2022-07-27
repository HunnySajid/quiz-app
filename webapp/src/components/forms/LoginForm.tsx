import { Button, TextField } from '@material-ui/core';
import axios, { AxiosError } from 'axios';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { UseMutateAsyncFunction, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { errorMessages, successMessages } from '../../shared/constants';
import { IAuthForm } from '../../shared/interfaces';
import { GetErrorResponse } from '../../shared/utils';
import { LoginUserValidation } from '../../shared/validationSchema';

interface Props {
  mutateAsync: UseMutateAsyncFunction<any, AxiosError<any, any>, any, unknown>;
  reset: () => void;
  redirect: string;
}

export const LoginForm: React.FC<Props> = ({
  mutateAsync,
  reset,
  redirect,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <Formik<IAuthForm>
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LoginUserValidation}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        setSubmitting(true);
        const body = { ...values };
        
        try {
          if (!!!values.email.trim()) {
            setFieldError('email', 'Only Spaces not allowed.');
            throw Error('Form Error');
          }
          if (!!!values.password.trim()) {
            setFieldError('password', 'Only Spaces not allowed.');
            throw Error('Form Error');
          }
          await mutateAsync(
            { body },
            {
              onSuccess: (user) => {
                queryClient.invalidateQueries('Quizzes');
                enqueueSnackbar(
                  successMessages.actionSuccess(
                    'Logged In',
                    'User'
                  )
                );
                localStorage.setItem('user', JSON.stringify(user))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
              },
              onError: (e) => {
                if (axios.isAxiosError(e)) {
                  const data = GetErrorResponse(e)
                  enqueueSnackbar(data.message, {
                    variant: "error",
                  });
                } else {
                  enqueueSnackbar(errorMessages.default, { variant: "error" });
                }
              },
              onSettled: () => {
                reset();
                setSubmitting(false);
              },
            }
          );
        } catch (e) {}
      }}
    >
      {({ handleSubmit, isSubmitting, handleChange, handleBlur, values, touched, errors }) => (
        <form className='pb-2' onSubmit={handleSubmit}>
          <div className='mx-10'>
            <div className=''>
              <TextField
                fullWidth
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                id='email'
                label='Email'
                variant='outlined'
              />
            </div>

            <div className='mt-6'>
              <TextField
                fullWidth
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                id='password'
                label='Password'
                variant='outlined'
                type='password'
              />
            </div>
            <div className='flex justify-end mt-4'>
              <Button
                variant='contained'
                color='primary'
                disabled={isSubmitting}
                type='submit'
              >
                { isSubmitting ? 'Logging In' : 'Login'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
