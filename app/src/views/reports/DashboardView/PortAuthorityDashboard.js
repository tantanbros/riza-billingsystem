import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { Container, Grid } from '@material-ui/core';
import Page from 'src/components/Page';
import ComplaintsStats from './ComplaintsStats';
import CreatePortAuthority from './CreatePortAuthority';
import InvoiceStats from './InvoiceStats';

const PortAuthorityDashboard = ({ classes }) => {
  const { data: stats } = useSWR(
    `${process.env.REACT_APP_API_URL}/stats/portAuthority`
  );

  return (
    <Page
      title="Dashboard"
      style={{ marginTop: '2%', marginLeft: '1%', marginRight: '1%' }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5} justify="center">
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <CreatePortAuthority />
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <ComplaintsStats
              stats={
                stats
                  ? {
                      ...stats?.complaintStats,
                      totalCustomers: stats?.totalCustomers
                    }
                  : { total: 0, pastMonth: 0, totalCustomers: 0 }
              }
            />
          </Grid>
          <Grid item lg={4} sm={6} xl={4} xs={12}>
            <InvoiceStats
              stats={
                stats
                  ? stats?.invoiceStats
                  : {
                      total: 0,
                      paid: 0,
                      unpaid: 0
                    }
              }
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

PortAuthorityDashboard.propTypes = {
  classes: PropTypes.any
};
export default PortAuthorityDashboard;
