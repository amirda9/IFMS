import {JSX} from 'react';
import {RedirectToLogin} from '~/components';

export const selectElement = (
  auth: boolean,
  Component: JSX.Element,
  redirect?: JSX.Element,
) => {
  return auth ? Component : redirect || RedirectToLogin;
};
