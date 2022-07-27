import React from 'react';
import { ErrorMessage } from '../components/ErrorMessage';
import LandingIllustration from '../assets/illustations/landing.png';
import Logo from '../assets/logos/White-Purple-Circle.png';
import { LoginForm } from '../components/forms/LoginForm';
import { useLogin } from '../shared/queries';

interface Props {}

export const Login: React.FC<Props> = () => {
  const { mutateAsync, reset, error } = useLogin();

  if (error?.response?.status) {
    return <ErrorMessage statusCode={error.response.status} />;
  }

  return (
    <div className=''>
      <div className='landing'>
        <div
          style={{ height: '90vh' }}
          className='flex flex-col md:flex-row items-center justify-between max-w-screen-xl mx-5 md:mx-auto'
        >
          <div className='w-12/12 md:w-6/12 flex items-center justify-center'>
            <div className='h-72 md:h-96 w-72 md:w-96'>
              <img
                src={LandingIllustration}
                className='h-full w-full object-cover'
                alt='landing'
              />
            </div>
          </div>
          <div className='w-12/12 md:w-6/12'>
            <div className='flex items-center'>
              <img
                src={Logo}
                className='h-20 w-20 object-cover'
                alt='landing'
              />
              <h1 className='text-2xl font-thin text-slate-800'>Login</h1>
            </div>
            <LoginForm
              mutateAsync={mutateAsync}
              reset={reset}
              redirect='/dashboard'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
