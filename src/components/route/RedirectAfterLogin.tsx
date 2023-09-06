import {Navigate, useLocation} from 'react-router-dom';

const RedirectToLogin = () => {
  const location = useLocation();
  return (
    <Navigate to={location.state?.from ? location : '/networks'} replace />
  );
};

export default RedirectToLogin;
