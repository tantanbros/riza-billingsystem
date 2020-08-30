import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors,
  Avatar
} from '@material-ui/core';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: theme.spacing(1)
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  differenceValue: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const WelcomeCustomer = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item xl={9} lg={9} xs={9}>
            <Typography color="textSecondary" gutterBottom variant="h6">
              WELCOME CUSTOMER
            </Typography>
            <Typography color="textSecondary" variant="caption">
              You can click on your bills to view their breakdown. You can also
              search for your bills. Don&apos;t forget to pay your bills
            </Typography>
          </Grid>
          <Grid item xl={3} lg={3} xs={3}>
            <Avatar className={classes.avatar}>
              <HomeRoundedIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

WelcomeCustomer.propTypes = {
  className: PropTypes.string
};

export default WelcomeCustomer;
