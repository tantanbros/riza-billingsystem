import React from 'react';
import useSWR from 'swr';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Grid, makeStyles } from '@material-ui/core';
import PointableTable from 'src/components/PointableTable';
import ChipStatus from 'src/components/ChipStatus';
import { currencySetting } from 'src/helpers/config';
import { getStatus } from 'src/helpers/getStatus';
import AppContext from 'src/contexts/AppContext';
import CustomerDashboard from 'src/views/reports/DashboardView/CustomerDashboard';
import ViewInvoiceForm from './ViewInvoiceForm';

const useStyles = makeStyles(() => ({
  root: {
    margin: '2%'
  }
}));

const CustomerBillsVew = ({ className, ...rest }) => {
  const classes = useStyles();
  const { signedUser } = React.useContext(AppContext);

  const [state, setState] = React.useState({
    columns: [
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
    `${process.env.REACT_APP_API_URL}/invoices/?customerId=${signedUser._id}`
  );
  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      data: invoices?.map(({ dateSent, status, totalAmount }) => ({
        dateBilled: new Date(dateSent),
        status: getStatus(status, signedUser.role).toUpperCase(),
        totalAmount: Number(totalAmount)
      }))
    }));
  }, [invoices, signedUser.role]);

  const [viewInvoice, setViewInvoice] = React.useState({
    open: false,
    setOpen: viewState => {
      setViewInvoice(prevState => ({
        ...prevState,
        open: viewState
      }));
    },
    invoice: null
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
      <CustomerDashboard />
      <Grid className={clsx(classes.root, className)} item>
        <div className={classes.table}>
          <PointableTable
            title="Bills History"
            columns={state.columns}
            data={state.data}
            onRowClick={(event, rowData) => handleRowClick(rowData)}
            options={{ pageSize: 10, sorting: true }}
          />
        </div>
      </Grid>
      <ViewInvoiceForm {...viewInvoice} />
    </>
  );
};

CustomerBillsVew.propTypes = {
  className: PropTypes.string
};

export default CustomerBillsVew;
