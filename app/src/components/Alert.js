import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = ({ open, severity, handleClose, children }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert onClose={handleClose} severity={severity} variant="filled" elevation={6}>
        {children}
      </MuiAlert>
    </Snackbar>
  );
};

Alert.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  severity: PropTypes.string,
  children: PropTypes.any
};

export default Alert;
