import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Grid,
  CardContent,
  CardHeader,
  Divider,
  TextField
} from '@material-ui/core';
import AppContext from 'src/contexts/AppContext';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Alert from 'src/components/Alert';

const UpdatePassword = ({ className }) => {
  const { signedUser } = React.useContext(AppContext);
  const [notification, setNotification] = React.useState({
    open: false,
    severity: 'info',
    message: ''
  });

  return (
    <Card>
      <Formik
        initialValues={{ password: '', newPassword: '', confirmPassword: '' }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .max(255)
            .required('Password is required'),
          newPassword: Yup.string()
            .max(255)
            .required('New Password is required'),
          confirmPassword: Yup.string()
            .max(255)
            .required('New Password is required')
        })}
        onSubmit={(
          { password, newPassword, confirmPassword },
          { setSubmitting, resetForm }
        ) => {
          if (newPassword !== confirmPassword) {
            setNotification({
              open: true,
              severity: 'error',
              message: 'New Password and Confirm Password must be the same'
            });
            setSubmitting(false);
          } else {
            fetch(`${process.env.REACT_APP_API_URL}/users/${signedUser._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                password,
                newPassword
              })
            })
              .then(res => {
                // No Content - means updated successfully
                if (res.status === 204) {
                  setNotification({
                    open: true,
                    severity: 'success',
                    message: 'Password updated successfully'
                  });
                } else if (res.status === 404) {
                  setNotification({
                    open: true,
                    severity: 'error',
                    message:
                      'Failed to update password. Please make sure you entered your correct password'
                  });
                }
              })
              .catch(err => console.error(err))
              .finally(() => {
                setSubmitting(false);
                resetForm();
              });
          }
        }}
        validateOnChange={false}
        validateOnBlur={false}
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
            <CardHeader subheader="Update password" title="Password" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Current Password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    fullWidth
                    helperText={touched.newPassword && errors.newPassword}
                    label="New Password"
                    name="newPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.newPassword}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(
                      touched.confirmPassword && errors.confirmPassword
                    )}
                    fullWidth
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    label="Confirm password"
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.confirmPassword}
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
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {notification?.open && (
        <Alert
          open
          severity={notification?.severity}
          handleClose={() => {
            setNotification(prevState => ({
              ...prevState,
              open: false
            }));
          }}
        >
          {notification?.message}
        </Alert>
      )}
    </Card>
  );
};

UpdatePassword.propTypes = {
  className: PropTypes.string
};

export default UpdatePassword;
