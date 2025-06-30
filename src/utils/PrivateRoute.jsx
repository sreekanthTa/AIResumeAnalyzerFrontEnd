import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {

  const isAuthenticated = useSelector((state) => state.auth.accessToken);
    // Check if the access token exists to determine authentication
    // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log("isAuthenticated", isAuthenticated);

//   return children;
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;