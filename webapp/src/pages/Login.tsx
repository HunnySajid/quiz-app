import React from 'react';
import { ErrorMessage } from "../components/ErrorMessage";
import { LoginForm } from "../components/forms/LoginForm";
import { useLogin } from "../shared/queries";

interface Props {}

export const Login: React.FC<Props> = () => {
  const { mutateAsync, reset, error } = useLogin();
  
  if (error?.response?.status) {
    return <ErrorMessage statusCode={error.response.status} />;
  }


  return (
    <div>
      <h2 className="text-2xl font-medium text-center mb-10">Login</h2>
      <div className="mx-auto md:w-6/12">
          <LoginForm
            mutateAsync={mutateAsync}
            reset={reset}
            redirect="/dashboard"
          />
        </div>
    </div>
  );
};
