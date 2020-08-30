import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { Container, Grid } from '@material-ui/core';
import Page from 'src/components/Page';
import AppContext from 'src/contexts/AppContext';
import MakeComplaint from './MakeComplaint';
import WelcomeCustomer from './WelcomeCustomer';
import InvoiceStats from './InvoiceStats';

const CustomerDashboard = ({ classes }) => {
  const { signedUser } = React.useContext(AppContext);
  const customerId = signedUser?._id;
  const { data: stats } = useSWR(
    `${process.env.REACT_APP_API_URL}/stats/customer/?customerId=${customerId}`
  );

  return (
    <Page
      title="Dashboard"
      style={{ marginTop: '2%', marginLeft: '1%', marginRight: '1%' }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3} justify="center">
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <WelcomeCustomer />
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <MakeComplaint />
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <InvoiceStats
              stats={
                stats || {
                  total: 0,
                  paid: 0,
                  unpaid: 0
                }
              }
              title="TOTAL BILLS"
              canCreate={false}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

CustomerDashboard.propTypes = {
  classes: PropTypes.any
};

export default CustomerDashboard;
