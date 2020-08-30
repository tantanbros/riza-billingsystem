import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import AppContext from 'src/contexts/AppContext';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Alert from 'src/components/Alert';

const isEqual = (prev, cur) => {
  return Object.keys(prev).every(key => prev[key] === cur[key]);
};

const ProfileDetails = ({ className, ...rest }) => {
  const { signedUser, setSavedUser } = React.useContext(AppContext);
  const [emailTaken, setEmailTaken] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [noChange, setNochange] = React.useState(false);

  return (
    <Card>
      <Formik
        initialValues={signedUser}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required'),
          firstName: Yup.string()
            .max(255)
            .required('First name is required'),
          lastName: Yup.string()
            .max(255)
            .required('Last name is required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          if (isEqual(signedUser, values)) {
            setNochange(true);
            setSubmitting(false);
            return;
          }
          setNochange(false);
          fetch(`${process.env.REACT_APP_API_URL}/users/${signedUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          })
            .then(res => {
              if (res.status === 409) {
                setEmailTaken(true);
                return;
              }
              // No Content - means updated successfully
              if (res.status === 204) {
                setSuccess(true);
                setSavedUser(values);
              }
            })
            .catch(err => console.error(err))
            .finally(() => setSubmitting(false));
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <CardHeader
              subheader="The information can be edited"
              title="Profile"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.firstName && errors.firstName)}
                    fullWidth
                    helperText={touched.firstName && errors.firstName}
                    label="First name"
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.lastName && errors.lastName)}
                    fullWidth
                    helperText={touched.lastName && errors.lastName}
                    label="Last name"
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                Save details
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {emailTaken && (
        <Alert open severity="error" handleClose={() => setEmailTaken(false)}>
          Email Address is Already Taken
        </Alert>
      )}
      {success && (
        <Alert open severity="success" handleClose={() => setSuccess(false)}>
          Profile was updated successfully
        </Alert>
      )}
      {noChange && (
        <Alert open severity="info" handleClose={() => setNochange(false)}>
          Profile information didn&apos;t change
        </Alert>
      )}
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
