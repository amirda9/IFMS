import React from 'react';
import {Navigate} from 'react-router-dom';

const RedirectToLogin = () => <Navigate to={'/networks'} replace />;

export default RedirectToLogin;
