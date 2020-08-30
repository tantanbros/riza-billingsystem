import React from 'react';
import { makeStyles } from '@material-ui/core';
import MaterialTable from 'material-table';

const useStyles = makeStyles(theme => ({
  table: {
    '& tbody>.MuiTableRow-root:hover': {
      backgroundColor: 'rgba(33, 150, 243, 0.25) !important',
      cursor: 'pointer'
    },
    fontFamily: 'Roboto'
  }
}));

const PointableTable = props => {
  const classes = useStyles();

  return (
    <div className={classes.table}>
      <MaterialTable {...props} />
    </div>
  );
};

export default PointableTable;
