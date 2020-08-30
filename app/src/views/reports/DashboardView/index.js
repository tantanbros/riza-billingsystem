import React from 'react';
import { makeStyles } from '@material-ui/core';
import AppContext from 'src/contexts/AppContext';
import { Role } from 'src/helpers/constants';
import InvoicesView from 'src/views/invoice/InvoicesView';
import CustomerDashboard from './CustomerDashboard';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const { signedUser } = React.useContext(AppContext);

  return (
    <>
      {signedUser?.role === Role.Customer && (
        <CustomerDashboard classes={classes} />
      )}
      {signedUser?.role === Role.PortAuthority && (
        <InvoicesView classes={classes} />
      )}
    </>
  );
};

export default Dashboard;
