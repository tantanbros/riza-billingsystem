import React from 'react';

const EmptyCustomer = {
  _id: '',
  firstName: '',
  lastName: '',
  email: ''
};

const InvoiceContext = React.createContext({
  selectedCustomer: EmptyCustomer,
  clearSelectedCustomer: () => {},
  customerEmpty: true,
  totalAmount: 0.0
});

export default InvoiceContext;
export { EmptyCustomer };
