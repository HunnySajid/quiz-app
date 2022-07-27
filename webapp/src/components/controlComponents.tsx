import React from 'react';
import { useUserContext, withUser } from '../contexts/UserContext';

export const SignedIn: React.FC = withUser(({ children }) => {
  return <>{children}</>;
}, 'SignedIn');

export const SignedOut: React.FC = ({ children }) => {
  const userCtx = useUserContext();
  return userCtx === null || userCtx?.value === null ? <>{children}</> : null;
  
};