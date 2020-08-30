import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Button,
  makeStyles
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import InvoiceContext from 'src/contexts/InvoiceContext';
import CustomerSelectorDialog from './CustomerSelectorDialog';

const useStyles = makeStyles(theme => ({
  alert: {
    marginBottom: theme.spacing(2)
  },
  buttonGrid: {
    padding: theme.spacing(2)
  },
  button: {
    minWidth: '12em'
  }
}));

const CustomerInformation = () => {
  const classes = useStyles();
  const { selectedCustomer, clearSelectedCustomer, customerEmpty } = React.useContext(
    InvoiceContext
  );

  // Customer Selector Dialog
  const [open, setOpen] = React.useState(false);

  return (
    <Card>
      <CardHeader title="Customer Information" subheader="Generate invoice for customer" />
      <Divider />
      <CardContent>
        {customerEmpty && (
          <Alert className={classes.alert} severity="info">
            You haven&apos;t selected a customer to charge. Please select one.
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label="First name"
              name="firstName"
              value={selectedCustomer.firstName}
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              label="Last name"
              name="lastName"
              value={selectedCustomer.lastName}
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={selectedCustomer.email}
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <Grid className={classes.buttonGrid} container spacing={2} justify="flex-end">
        <Grid item>
          <Button
            className={classes.button}
            color="primary"
            variant="outlined"
            onClick={clearSelectedCustomer}
          >
            Clear Selection
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Select Customer
          </Button>
        </Grid>
      </Grid>
      <CustomerSelectorDialog open={open} handleClose={() => setOpen(false)} />
    </Card>
  );
};

export default CustomerInformation;
