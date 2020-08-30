import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  Avatar,
  colors
} from '@material-ui/core';
import MakeComplaintView from 'src/views/complaints/MakeComplaintView';
import MoodBadRoundedIcon from '@material-ui/icons/MoodBadRounded';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: theme.spacing(1)
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

const MakeComplaint = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item xl={9} lg={9} xs={9}>
            <Typography color="textSecondary" gutterBottom variant="h6">
              GOT ANY CONCERNS?
            </Typography>
            <Typography color="textSecondary" variant="caption">
              If you have any concerns regarding our service, you can make a
              complaint here.
            </Typography>
          </Grid>
          <Grid item xl={3} lg={3} xs={3}>
            <Avatar className={classes.avatar}>
              <MoodBadRoundedIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <MakeComplaintView />
        </Box>
      </CardContent>
    </Card>
  );
};

MakeComplaint.propTypes = {
  className: PropTypes.string
};

export default MakeComplaint;
