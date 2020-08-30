import React from 'react';
// import { Role } from 'src/helpers/constants';

const EmptyUser = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: null
};

const AppContext = React.createContext({
  signedUser: EmptyUser,
  setSavedUser: () => {},
  logout: () => {},
  isAuthenticated: false
});

export default AppContext;
export { EmptyUser };
