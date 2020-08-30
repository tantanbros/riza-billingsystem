import React from 'react';
import useSWR, { mutate } from 'swr';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';
import PointableTable from 'src/components/PointableTable';
import Alert from 'src/components/Alert';
import ChipStatus from 'src/components/ChipStatus';
import { toFullName } from 'src/helpers/toFullName';
import { getStatus } from 'src/helpers/getStatus';
import { currencySetting } from 'src/helpers/config';
import PortAuthorityDashboard from 'src/views/reports/DashboardView/PortAuthorityDashboard';
import ViewInvoiceForm from './ViewInvoiceForm';

const useStyles = makeStyles(() => ({
  root: {
    margin: '2%'
  }
}));

const InvoicesView = ({ className, ...rest }) => {
  const classes = useStyles();

  const [notification, setNotification] = React.useState({
    open: false,
    severity: 'info',
    message: ''
  });

  const [state, setState] = React.useState({
    columns: [
      { title: 'Customer', field: 'name' },
      { title: 'Email', field: 'email', align: 'center' },
      { title: 'Date Billed', field: 'dateBilled', type: 'date' },
      {
        title: 'Status',
        field: 'status',
        align: 'center',
        render: rowData => <ChipStatus label={rowData.status} />
      },
      {
        title: 'Total Amount',
        field: 'totalAmount',
        align: 'right',
        type: 'currency',
        currencySetting
      }
    ],
    data: []
  });

  const { data: invoices } = useSWR(
    `${process.env.REACT_APP_API_URL}/invoices`
  );
  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      data: invoices?.map(({ customer, totalAmount, status, dateSent }) => ({
        name: toFullName(customer),
        email: customer.email,
        totalAmount: Number(totalAmount),
        status: getStatus(status).toUpperCase(),
        dateBilled: new Date(dateSent)
      }))
    }));
  }, [invoices]);

  const updateStatus = React.useCallback(() => {
    mutate(`${process.env.REACT_APP_API_URL}/invoices`);
  }, []);

  const [viewInvoice, setViewInvoice] = React.useState({
    open: false,
    setOpen: viewState => {
      setViewInvoice(prevState => ({
        ...prevState,
        open: viewState
      }));
    },
    invoice: null,
    updateStatus,
    setNotification
  });

  // Get the id of the row for the table and use it to get the invoice data from the list
  const handleRowClick = ({ tableData: { id } }) => {
    const invoiceToView = invoices[id];
    if (!invoiceToView) {
      console.error('There was a problem viewing the invoice');
      return;
    }

    setViewInvoice(prevState => ({
      ...prevState,
      open: true,
      invoice: invoiceToView
    }));
  };

  return (
    <>
      <PortAuthorityDashboard />
      <Grid className={clsx(classes.root, className)} item>
        {/* <Button variant="outlined" color="primary" href="/invoice">
          Create Invoice
        </Button> */}
        <div className={classes.table}>
          <PointableTable
            title="Invoices"
            columns={state.columns}
            data={state.data}
            onRowClick={(event, rowData) => handleRowClick(rowData)}
            options={{ pageSize: 10, sorting: true }}
          />
        </div>
      </Grid>
      <ViewInvoiceForm {...viewInvoice} />
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
    </>
  );
};

InvoicesView.propTypes = {
  className: PropTypes.string
};

export default InvoicesView;
