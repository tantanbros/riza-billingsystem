import React from 'react';
import { Container, Grid, makeStyles, Box } from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import UpdatePassword from './UpdatePassword';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Profile">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item lg={4} md={6} xs={12}>
            <Profile />
          </Grid>
          <Grid container item lg={8} md={6} xs={12}>
            <Grid item lg={12} md={12} xs={12}>
              <Box mb={3}>
                <ProfileDetails />
              </Box>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <UpdatePassword />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;
