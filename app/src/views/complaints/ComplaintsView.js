import React from 'react';
import useSWR from 'swr';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Grid, Container, makeStyles } from '@material-ui/core';
import PointableTable from 'src/components/PointableTable';
import { toFullName } from 'src/helpers/toFullName';
import Page from 'src/components/Page';

const useStyles = makeStyles(() => ({
  root: {
    margin: '2%'
  }
}));

const ComplaintsView = ({ className, ...rest }) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    columns: [
      { title: 'Complainant', field: 'name' },
      { title: 'Email', field: 'email' },
      { title: 'Message', field: 'message' },
      { title: 'Date Submitted', field: 'dateSubmitted', type: 'date' }
    ],
    data: []
  });

  const { data: complaints } = useSWR(
    `${process.env.REACT_APP_API_URL}/complaints`
  );
  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      data: complaints?.map(({ _id, complainant, message, dateSubmitted }) => ({
        message,
        dateSubmitted: new Date(dateSubmitted),
        email: complainant.email,
        name: toFullName(complainant)
      }))
    }));
  }, [complaints]);

  return (
    <Page className={classes.root} title="Complaints">
      <Container maxWidth="xl">
        <Grid className={clsx(classes.root, className)} item>
          <div className={classes.table}>
            <PointableTable
              title="Customer Complaints"
              columns={state.columns}
              data={state.data}
              options={{ pageSize: 10 }}
            />
          </div>
        </Grid>
      </Container>
    </Page>
  );
};

ComplaintsView.propTypes = {
  className: PropTypes.string
};

export default ComplaintsView;
