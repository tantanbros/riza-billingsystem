import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { SWRConfig } from 'swr';
import AppContext, { EmptyUser } from 'src/contexts/AppContext';
import { userNotEmpty } from 'src/helpers/userNotEmpty';

const App = () => {
  const routing = useRoutes(routes);
  const navigate = useNavigate();
  const [signedUser, setSignedUser] = React.useState(
    JSON.parse(localStorage.getItem('SignedUser'))
  );

  const setSavedUser = React.useCallback(user => {
    // this is called on login, we set the user to the state and save it in local storage
    setSignedUser(user);
    localStorage.setItem('SignedUser', JSON.stringify(user));
  }, []);

  const logout = React.useCallback(() => {
    setSignedUser(EmptyUser);
    localStorage.removeItem('SignedUser');
    navigate('/', { replace: true });
  }, [navigate]);

  const isAuthenticated = React.useMemo(
    // every prop in the signedUser must not be empty to know that we are authenticated
    () => userNotEmpty(signedUser),
    [signedUser]
  );

  const providerValue = React.useMemo(
    () => ({
      signedUser,
      setSavedUser,
      logout,
      isAuthenticated
    }),
    [signedUser, setSavedUser, logout, isAuthenticated]
  );

  return (
    <SWRConfig
      value={{
        fetcher: (...args) => fetch(...args).then(res => res.json())
      }}
    >
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppContext.Provider value={providerValue}>
          {routing}
        </AppContext.Provider>
      </ThemeProvider>
    </SWRConfig>
  );
};

export default App;
