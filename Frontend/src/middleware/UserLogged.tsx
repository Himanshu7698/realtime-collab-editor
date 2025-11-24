import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const UserLogged = () => {
  const navigate = useNavigate();
  const [checkLoggedIn, setCheckLoggedIn] = useState(false);

  const checkUserToken = () => {
    const getToken = () => localStorage.getItem('token');
    const userToken = getToken();
    if (userToken) {
      setCheckLoggedIn(false);
      return navigate('/');
    } else {
      setCheckLoggedIn(true);
    }
  };
  useEffect(() => {
    checkUserToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkUserToken]);
  return <>{checkLoggedIn ? <Outlet /> : null}</>;
};
export default UserLogged;
