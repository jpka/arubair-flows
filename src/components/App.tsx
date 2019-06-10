import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { 
	colors, Paper
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { createMuiTheme, Theme, withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { withSnackbar } from 'notistack';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux';

import { 
	State, 
	Dashboard 
} from '../index';
import { actions as usersActions } from '../modules/users';
import LoginForm from './forms/Login';
import { styles as drawerStyles } from './Drawer';

declare module "@material-ui/core/styles/createMuiTheme" {
	interface ThemeOptions {
		status?: any
	}
}

const theme = createMuiTheme({
	palette: {
		primary: {
			main: colors.orange[500]
		},
		secondary: {
			main: colors.red[700]
		}
	},
	status: {danger: 'red'}
});

export const useStyles = makeStyles((theme: Theme) => createStyles({
	middleBottomFab: {
		position: "absolute",
		left: "50%",
		marginLeft: -24,
		bottom: -24,
		zIndex: 999
	},
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	buttonProgress: {
		color: colors.red[700],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	}
}));

const Notification = connect(
	({ui}: State) => ({notification: ui.notification})
)(withSnackbar(({enqueueSnackbar, notification}: any) => {
	if (notification) useEffect(() => { enqueueSnackbar(notification.message, { variant: notification.type }) });
	return <div></div>;
}));

const Login = connect(
	// ({users}: State) => ({ error: users.error }),
	null,
	(dispatch: any) => ({
		onSubmit: (values) => { dispatch(usersActions.login(values)); }
	})
)(withStyles(drawerStyles)(LoginForm));

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<Route path="/login" render={() => <div style={{
						width: 300,
						margin: "0 auto",
						padding: 10,
						position: "relative",
						top: "50vh",
						transform: "translateY(-50%)"
					}}>
						<Paper style={{padding: "20px 30px"}}>
							<Login />
						</Paper>
					</div>} />
					<Route path="/" component={Dashboard} />
				</Switch>
			</Router>
			{/* <Router>
				<Switch>
				<Route path="/users" component={Users} />
				<Route path="/" component={Dashboard} />
				</Switch>
			</Router> */}
			<Notification />
		</ThemeProvider>
	);
};

export default App;
