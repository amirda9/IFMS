import React from 'react';
import {RedirectToLogin} from '~/components';

export const selectElement = (
  auth: boolean,
  Component: React.ComponentType,
  redirect?: React.ComponentType,
) => {
  return auth ? Component : redirect || RedirectToLogin;
};
