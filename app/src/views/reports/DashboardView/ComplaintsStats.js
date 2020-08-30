import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import ReportIcon from '@material-ui/icons/Report';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: theme.spacing(1)
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceValue: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

const ComplaintsStats = ({
  className,
  stats: { total = 0, pastMonth = 0, totalCustomers = 0 },
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item xl={9} lg={9} xs={9}>
            <Typography color="textSecondary" gutterBottom variant="h6">
              CUSTOMERS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {totalCustomers}
            </Typography>
          </Grid>
          <Grid item xl={3} lg={3} xs={3}>
            <Avatar className={classes.avatar}>
              <ReportIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box>
          <Typography color="textSecondary" variant="overline">
            You received
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <Typography
            className={classes.differenceValue}
            style={{
              color: pastMonth <= 3 ? colors.green[500] : colors.red[900]
            }}
            variant="body2"
          >
            {pastMonth}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            complaints in the past 30 days
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Typography
            className={classes.differenceValue}
            style={{
              color: pastMonth <= 3 ? colors.green[500] : colors.red[900]
            }}
            variant="body2"
          >
            {pastMonth}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            complaints in total
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

ComplaintsStats.propTypes = {
  className: PropTypes.string,
  stats: PropTypes.object
};

export default ComplaintsStats;
