import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import AppContext from 'src/contexts/AppContext';
import { Role } from 'src/helpers/constants';
import { toFullName } from 'src/helpers/toFullName';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReportIcon from '@material-ui/icons/Report';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import NavItem from './NavItem';

const customerItems = [
  {
    href: '/customer',
    icon: DashboardIcon,
    title: 'Dashboard'
  },
  {
    href: '/profile',
    icon: AccountBoxRoundedIcon,
    title: 'Profile'
  },
  {
    href: '/logout',
    icon: ExitToAppIcon,
    title: 'Logout'
  }
];

const authorityItems = [
  {
    href: '/portauthority',
    icon: DashboardIcon,
    title: 'Dashboard'
  },
  {
    href: '/profile',
    icon: AccountBoxRoundedIcon,
    title: 'Profile'
  },
  {
    href: '/complaints',
    icon: ReportIcon,
    title: 'Complaints'
  },
  {
    href: '/logout',
    icon: ExitToAppIcon,
    title: 'Logout'
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { signedUser } = React.useContext(AppContext);

  const dashboardItems = React.useMemo(() => {
    if (signedUser.role === Role.Customer) {
      return customerItems;
    }
    if (signedUser.role === Role.PortAuthority) {
      return authorityItems;
    }
    return [];
  }, [signedUser]);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const avatar = signedUser?.profilePicture
    ? `${process.env.REACT_APP_API_URL}/files/${signedUser?.profilePicture}`
    : '/static/images/avatars/avatar_default.png';

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar className={classes.avatar} src={avatar} />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {toFullName(signedUser)}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {`${signedUser?.role}`}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {dashboardItems.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
