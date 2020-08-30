import React from 'react';
import useSWR from 'swr';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  CardHeader
} from '@material-ui/core';
import PointerTable from 'src/components/PointableTable';
import InvoiceContext from 'src/contexts/InvoiceContext';

const CustomerSelectorDialog = ({ open, handleClose }) => {
  const { setSelectedCustomer } = React.useContext(InvoiceContext);
  const [state, setState] = React.useState({
    columns: [
      { title: 'First Name', field: 'firstName' },
      { title: 'Last Name', field: 'lastName' },
      { title: 'Email', field: 'email' }
    ],
    data: []
  });

  const { data: customers } = useSWR(
    `${process.env.REACT_APP_API_URL}/users/?role=customer`
  );
  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      data: customers?.map(({ _id, firstName, lastName, email }) => ({
        _id,
        firstName,
        lastName,
        email
      }))
    }));
  }, [customers]);

  const handleRowClick = rowData => {
    setSelectedCustomer(rowData);
    handleClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth
    >
      <CardHeader
        title="Customer Selection"
        subheader="Click on the row to select a customer"
      />
      <DialogContent dividers>
        <PointerTable
          title="Customers"
          columns={state.columns}
          data={state.data}
          onRowClick={(event, rowData) => handleRowClick(rowData)}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CustomerSelectorDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

export default CustomerSelectorDialog;
