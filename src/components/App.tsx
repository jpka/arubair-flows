import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { 
	colors
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider, withSnackbar } from 'notistack';

import { 
	State, 
	Dashboard 
} from '../index';
import { connect } from 'react-redux';

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
	if (notification) enqueueSnackbar(notification.message, { variant: notification.type });
	return <div></div>;
}));

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Dashboard />
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
