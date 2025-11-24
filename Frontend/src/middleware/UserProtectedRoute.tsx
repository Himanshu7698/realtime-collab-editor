import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const UserProtectedRoute = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const checkUserToken = () => {
    const Token = localStorage.getItem('token');
    if (!Token || Token === 'undefined') {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      return navigate('/login');
    } else {
      setIsLoggedIn(true);
    }
  };
  useEffect(() => {
    checkUserToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkUserToken]);
  return <>{isLoggedIn ? <Outlet /> : null}</>;
};

export default UserProtectedRoute;
