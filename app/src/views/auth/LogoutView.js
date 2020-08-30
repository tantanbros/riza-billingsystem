import React from 'react';
import AppContext from 'src/contexts/AppContext';

const LogoutView = () => {
  const { logout } = React.useContext(AppContext);

  React.useEffect(() => {
    logout();
  }, [logout]);

  return <div>Logging Out</div>;
};

export default LogoutView;
