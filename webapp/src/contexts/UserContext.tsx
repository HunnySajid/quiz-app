import React, { useContext } from 'react';

interface UserResource {
  _id: string;
  name: string;
  email: string;
  token: string;
}

type UserTypes = UserResource | null | undefined;
type UserContextValue = { value: UserTypes } | undefined;
const user = JSON.parse(localStorage.getItem('user') ?? 'null');

export const UserContext = React.createContext<UserContextValue | undefined>(
  { value: user}
);
UserContext.displayName = 'UserContext';

export function useUserContext(): UserContextValue {
  const userCtx = useContext(UserContext);
  return userCtx;
}

export function useUser(): UserTypes {
  const userCtx = useUserContext();
  return userCtx?.value;
}

export const withUser = <P extends { user: UserResource }>(
  Component: React.ComponentType<P>,
  displayName?: string
) => {
  displayName =
    displayName || Component.displayName || Component.name || 'Component';
  Component.displayName = displayName;

  const HOC: React.FC<Omit<P, 'user'>> = (props: Omit<P, 'user'>) => {
    const userCtx = useContext(UserContext);
    const user = userCtx?.value;
    if (user) {
      return <Component {...(props as P)} user={user} />;
    }

    return null;
  };

  HOC.displayName = `withUser(${displayName})`;
  return HOC;
};
