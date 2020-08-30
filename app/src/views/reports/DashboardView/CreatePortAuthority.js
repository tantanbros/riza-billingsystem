import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import SupervisorAccountRoundedIcon from '@material-ui/icons/SupervisorAccountRounded';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: theme.spacing(1)
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  },
  differenceValue: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const CreatePortAuthority = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item xl={9} lg={9} xs={9}>
            <Typography color="textSecondary" gutterBottom variant="h6">
              AUTHORIZED USER
            </Typography>
            <Typography color="textSecondary" variant="caption">
              Authorized users have elevated privileges. You can create other
              authorized users here
            </Typography>
          </Grid>
          <Grid item xl={3} lg={3} xs={3}>
            <Avatar className={classes.avatar}>
              <SupervisorAccountRoundedIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="primary" href="/registerauthorized">
            Create Authority
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CreatePortAuthority.propTypes = {
  className: PropTypes.string
};

export default CreatePortAuthority;
