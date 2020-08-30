import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Divider,
  Box,
  Slide
} from '@material-ui/core';
import PointableTable from 'src/components/PointableTable';
import ConfirmDialog from 'src/components/ConfirmDialog';
import ChipStatus from 'src/components/ChipStatus';
import { toCurrency } from 'src/helpers/numbers';
import { currencySetting } from 'src/helpers/config';
import AppContext from 'src/contexts/AppContext';
import { getStatus } from 'src/helpers/getStatus';
import { toFullName } from 'src/helpers/toFullName';
import { Status, Role } from 'src/helpers/constants';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GridOverline = ({ label, value }) => {
  return (
    <Grid container direction="row">
      <Grid container item sm={3} direction="column">
        <Typography variant="h5">{label}</Typography>
      </Grid>
      <Grid item sm={9}>
        <Typography variant="overline">
          <Typography variant="body2" gutterBottom>
            {value}
          </Typography>
        </Typography>
      </Grid>
    </Grid>
  );
};

GridOverline.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any
};

const ViewInvoiceForm = ({
  open,
  setOpen,
  invoice,
  updateStatus,
  setNotification
}) => {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Description', field: 'description' },
      {
        title: 'Amount',
        field: 'amount',
        align: 'right',
        type: 'currency',
        currencySetting
      }
    ],
    data: []
  });
  const { signedUser } = React.useContext(AppContext);
  const [paging, setPaging] = React.useState(false);
  const isPaid = React.useMemo(
    () => invoice?.status?.toUpperCase() === Status.Paid.toUpperCase(),
    [invoice]
  );
  const isPortAuthority = React.useMemo(
    () => signedUser?.role === Role.PortAuthority,
    [signedUser]
  );

  React.useEffect(() => {
    // update the table when the invoice prop changes
    setState(prevState => ({
      ...prevState,
      data: invoice
        ? invoice.billingItems.map(item => ({
            ...item,
            amount: Number(item.amount)
          }))
        : []
    }));

    setPaging(invoice?.billingItems?.length > 5 || false);
  }, [invoice]);

  // formatted properties to display in jsx below
  const { invoiceId, invoiceDate, status, fullName, email } = {
    invoiceId: invoice?._id,
    invoiceDate: new Date(invoice?.dateSent).toDateString(),
    status: getStatus(invoice?.status, signedUser?.role, invoice?.datePaid),
    fullName: toFullName(invoice?.customer),
    email: invoice?.customer?.email
  };

  // props for payment confirmation dialog

  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const confirmDialogProps = {
    open: openConfirmation,
    handleCancel: () => setOpenConfirmation(false),
    handleConfirm: () => {
      setOpenConfirmation(false);
      fetch(`${process.env.REACT_APP_API_URL}/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Paid' })
      })
        .then(res => {
          // No Content - means updated successfully
          if (res.status === 204) {
            // update our status in the table
            updateStatus(invoiceId);
            setOpen(false);
            setNotification({
              open: true,
              severity: 'success',
              message: 'Invoices updated successfully'
            });
          }
        })
        .catch(err => {
          console.error(err);
          setOpen(false);
          setNotification({
            open: true,
            severity: 'error',
            message: 'There was a problem in the server. Please try again'
          });
        });
    },
    title: 'Payment Confirmation',
    message: 'Are you sure you want to confirm the payment for this invoice?'
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title" disableTypography>
        <Typography variant="h3">Invoice</Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box mt={2} mb={1} alignItems="center">
          <GridOverline label="Invoice ID:" value={invoiceId} />
          <GridOverline label="Invoice Date:" value={invoiceDate} />
        </Box>
        <Box mb={2}>
          <GridOverline label="Status:" value={<ChipStatus label={status} />} />
        </Box>
        <Box mb={2}>
          <Typography variant="h5" display="block" gutterBottom>
            BILL TO
          </Typography>
          <Divider />
        </Box>

        <Box mb={3} alignItems="center">
          <GridOverline label="Name:" value={fullName} />
          <GridOverline label="Email Address:" value={email} />
        </Box>

        <PointableTable
          columns={state.columns}
          data={state.data}
          options={{
            paging,
            pageSize: 5,
            sorting: true,
            toolbar: false
          }}
        />
        <Box mt={2} ml={2} mr={2} alignItems="center">
          <Grid container direction="row" justify="flex-end">
            <Grid item sm={3}>
              <Typography variant="h5"> TOTAL AMOUNT</Typography>
            </Grid>
            <Grid item sm={9}>
              <Typography variant="h3" gutterBottom align="right">
                {`₱ ${toCurrency(invoice?.totalAmount)}`}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Close
        </Button>
        {!isPaid && isPortAuthority && (
          <Button
            onClick={() => setOpenConfirmation(true)}
            color="primary"
            variant="contained"
          >
            Paid
          </Button>
        )}
      </DialogActions>
      <ConfirmDialog {...confirmDialogProps} />
    </Dialog>
  );
};

ViewInvoiceForm.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  invoice: PropTypes.object,
  updateStatus: PropTypes.func,
  setNotification: PropTypes.func
};

export default ViewInvoiceForm;
