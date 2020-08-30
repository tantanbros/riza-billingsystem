import React from 'react';
import { useNavigate } from 'react-router';
import { Container, Typography, Box, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Alert from 'src/components/Alert';
import InvoiceContext, { EmptyCustomer } from 'src/contexts/InvoiceContext';
import CustomerInformation from './CustomerInformation';
import BillingInformation from './BillingInformation';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

const BuildInvoiceView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [notification, setNotification] = React.useState({
    open: false,
    severity: 'info',
    message: ''
  });

  const [selectedCustomer, setSelectedCustomer] = React.useState(EmptyCustomer);
  const clearSelectedCustomer = React.useCallback(() => {
    setSelectedCustomer(EmptyCustomer);
  }, [setSelectedCustomer]);

  // Check all properties of the selected customer if empty
  // if empty, then its the default => no customer selected
  const customerEmpty = Object.keys(selectedCustomer).every(
    key => !selectedCustomer[key]
  );
  const [totalAmount, setTotalAmount] = React.useState(0);

  const providerValue = React.useMemo(
    () => ({
      selectedCustomer,
      setSelectedCustomer,
      clearSelectedCustomer,
      customerEmpty,
      totalAmount,
      setTotalAmount
    }),
    [
      selectedCustomer,
      setSelectedCustomer,
      clearSelectedCustomer,
      customerEmpty,
      totalAmount,
      setTotalAmount
    ]
  );

  const handleSubmit = ({ billingItems }) => {
    if (customerEmpty) {
      // show alert when submitting and no customer is selected
      setNotification({
        open: true,
        severity: 'warning',
        message: 'Oops! You need to select a customer to submit this invoice'
      });
      return;
    }

    // TODO: Get the billerId from the logged in, port authority
    const loggedPortAuthority = {
      _id: '5f4058428d692b42ec8738e9'
    };
    const invoiceToCreate = {
      customer: selectedCustomer._id,
      biller: loggedPortAuthority._id,
      billingItems,
      totalAmount
    };

    fetch(`${process.env.REACT_APP_API_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoiceToCreate)
    })
      .then(res => {
        const success = res.status === 200;
        setNotification({
          open: true,
          severity: success ? 'success' : 'error',
          message: success
            ? 'The invoice was submitted to the customer'
            : 'There was a problem in the server. Please try again'
        });

        // go to the invoices list after successful create of invoice
        setTimeout(() => {
          navigate('/invoices');
        }, 500);
      })
      .catch(err => {
        console.error(err);
        setNotification({
          open: true,
          severity: 'error',
          message: 'There was a problem in the server. Please try again'
        });
      });
  };

  return (
    <Page className={classes.root} title="Invoice">
      <InvoiceContext.Provider value={providerValue}>
        <Container maxWidth="lg">
          <Typography variant="h1">Invoice</Typography>
          <Box mt={3}>
            <CustomerInformation />
          </Box>
          <Box mt={3}>
            <BillingInformation onSubmit={handleSubmit} />
          </Box>
        </Container>
      </InvoiceContext.Provider>
      {notification?.open && (
        <Alert
          open
          severity={notification?.severity}
          handleClose={() => {
            setNotification(prevState => ({
              ...prevState,
              open: false
            }));
          }}
        >
          {notification?.message}
        </Alert>
      )}
    </Page>
  );
};

export default BuildInvoiceView;
