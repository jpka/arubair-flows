import React, { FC } from 'react';
import { Paper, withStyles } from '@material-ui/core';
import { actions as usersActions } from '../modules/users';
import { connect } from 'react-redux';
import LoginForm from './forms/Login';
import { styles as drawerStyles } from './Drawer';
import { Redirect } from "react-router-dom";
import { State } from "../index";

const Login = ({classes, onSubmit, currentUser, ...props}) => {
	if (currentUser) return <Redirect to="/" />;
	return (
		<LoginForm classes={classes} onSubmit={onSubmit} {...props} />
	)
}

export default connect(
	// ({users}: State) => ({ error: users.error }),
	({users}: State) => ({currentUser: users.current}),
	(dispatch: any) => ({
		onSubmit: (values) => { dispatch(usersActions.login(values)); }
	})
)(withStyles(drawerStyles)(Login));