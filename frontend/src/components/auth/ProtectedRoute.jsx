import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isPlannerAuthenticated } from '../../lib/auth';

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isPlannerAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
