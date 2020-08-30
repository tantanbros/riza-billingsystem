import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors,
  Button,
  Box,
  Divider
} from '@material-ui/core';
import ReceiptRoundedIcon from '@material-ui/icons/ReceiptRounded';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: theme.spacing(1)
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  },
  divider: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4)
  },
  paid: { color: colors.green[500], marginRight: theme.spacing(1) },
  unpaid: { color: colors.red[900], marginRight: theme.spacing(1) }
}));

const InvoiceStats = ({
  className,
  stats: { total = 0, paid = 0, unpaid = 0 },
  title = 'TOTAL INVOICES',
  canCreate = true,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item xl={9} lg={9} xs={9}>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {total}
            </Typography>
          </Grid>
          <Grid item xl={3} lg={3} xs={3}>
            <Avatar className={classes.avatar}>
              <ReceiptRoundedIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={1} display="flex" alignItems="center" justifyContent="center">
          <Typography className={classes.paid} variant="h5">
            {paid}
          </Typography>
          <Typography color="textSecondary" variant="overline">
            PAID
          </Typography>
          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />
          <Typography className={classes.unpaid} variant="h5">
            {unpaid}
          </Typography>
          <Typography color="textSecondary" variant="overline">
            UNPAID
          </Typography>
        </Box>
        {canCreate && (
          <Box mt={1} display="flex" justifyContent="flex-end">
            <Button variant="outlined" color="primary" href="/invoice">
              Create Invoice
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

InvoiceStats.propTypes = {
  className: PropTypes.string,
  stats: PropTypes.object,
  title: PropTypes.string,
  canCreate: PropTypes.bool
};

export default InvoiceStats;
