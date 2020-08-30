import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import AppContext from 'src/contexts/AppContext';

const PrivateRoute = ({ role, children, ...rest }) => {
  const { signedUser } = React.useContext(AppContext);

  return (
    <>{signedUser.role === role ? children : <Navigate to="/404" replace />}</>
  );
};

PrivateRoute.propTypes = {
  role: PropTypes.string,
  children: PropTypes.any
};

export default PrivateRoute;
