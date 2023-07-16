import React from 'react';
import {Navigate} from 'react-router-dom';

const RedirectToLogin = () => <Navigate to={'/users'} replace />;

export default RedirectToLogin;
