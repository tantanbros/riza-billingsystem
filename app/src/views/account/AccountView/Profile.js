import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import AppContext from 'src/contexts/AppContext';
import { toFullName } from 'src/helpers/toFullName';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const { signedUser, setSavedUser } = React.useContext(AppContext);
  const avatar = signedUser?.profilePicture
    ? `${process.env.REACT_APP_API_URL}/files/${signedUser?.profilePicture}`
    : '/static/images/avatars/avatar_default.png';

  const handleUpload = event => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file, file.name);

    fetch(`${process.env.REACT_APP_API_URL}/users/${signedUser._id}/upload`, {
      method: 'PATCH',
      body: formData
    })
      .then(async res => {
        if (res.status === 200) {
          const { profilePicture } = await res.json();
          setSavedUser({
            ...signedUser,
            profilePicture
          });
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Avatar className={classes.avatar} src={avatar} />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {toFullName(signedUser)}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {`${signedUser.email} `}
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="body1"
          >
            {signedUser.role}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid container justify="center">
          <Grid item>
            <label htmlFor="contained-button-file">
              <Button color="primary" variant="text" component="span">
                Upload picture
              </Button>
              <input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                style={{ display: 'none' }}
                onChange={handleUpload}
              />
            </label>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
