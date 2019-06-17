import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { connect } from 'react-redux';
// import { 
//   colors
// } from '@material-ui/core';
// import {
//   Add as AddIcon
// } from '@material-ui/icons';
import { State } from '../index';
import {
  actions as uiActions
} from '../modules/ui';
import {
  actions as userActions
} from '../modules/users';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(9),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(10),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  });

export interface Props extends WithStyles<typeof styles> {
  position: any,
  addUser: () => any,
  logout: () => any,
  editUser: (id) => any,
  user: any
}

interface AppBarState {
  anchorEl: null | HTMLElement;
  mobileMoreAnchorEl: null | HTMLElement;
  menu: {
    name?: string,
    origin?: number | 'left' | 'right' | 'center'
  };
}

class PrimarySearchAppBar extends React.Component<Props, AppBarState> {
  state: AppBarState = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    menu: {}
  };

  handleMenuOpen = (name, origin) => (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ 
      anchorEl: event.currentTarget,
      menu: {
        name,
        origin
      }
    });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  menuAction = (action) => () => {
    this.handleMenuClose();
    action();
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl, menu } = this.state;
    const { classes, addUser, editUser, logout, user } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    console.log(user);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: menu.origin || 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: menu.origin || 'left' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        {menu.name === "profile" && [
          <MenuItem key={1} onClick={this.menuAction(() => editUser(user.uid))}>Edit user</MenuItem>,
          <MenuItem key={2} onClick={this.menuAction(logout)}>Logout</MenuItem>
        ]}
        {menu.name === "actions" && [
          <MenuItem key={1} onClick={this.menuAction(addUser)}>Add user</MenuItem>
        ]}
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleMenuOpen("profile", "left")}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.handleMenuOpen("actions", "left")} className={classes.menuButton} color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            {/* <IconButton color="inherit" style={{
              backgroundColor: colors.orange[300], 
              // color: "#fff",
              marginRight: "20px"
            }}>
              <AddIcon />
            </IconButton> */}
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Workflows
            </Typography>
            {/* <IconButton color="inherit"  style={{
                backgroundColor: colors.grey[700], 
                color: "#fff",
                marginLeft: "10px"
              }}> */}
              {/* <Fab color="secondary" style={{marginLeft: "10px", marginRight: "-10px"}} size="medium" aria-label="Add"> */}
                {/* <AddIcon /> */}
              {/* </Fab> */}
            {/* </IconButton> */}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {/* <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton> */}
              <IconButton color="inherit">
                <Badge badgeContent={user.overdueTasks ? user.overdueTasks.length : 0} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenuOpen("profile", "right")}
                color="inherit"
              >
                <Avatar src="/imgs/profile/boy.png" />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

(PrimarySearchAppBar as React.ComponentClass<Props>).propTypes = {
  classes: PropTypes.object.isRequired,
} as any;

export default connect(
  ({users}: State) => ({ user: users.current }),
  ({
    addUser: uiActions.newUser, 
    editUser: uiActions.editUser,
    logout: userActions.logout
  })
)(withStyles(styles)(PrimarySearchAppBar));