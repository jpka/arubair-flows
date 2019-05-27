import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { 
	colors
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { Dashboard } from '../index';

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

export const useStyles = makeStyles({
	middleBottomFab: {
		position: "absolute",
		left: "50%",
		marginLeft: -24,
		bottom: -24,
		zIndex: 999
	}
});

const App: React.FC = () => {
	// const [drawerOpen, setDrawerState] = useState(true);
	// const setDrawerState = (state) => {};
	// const drawe
	return (
		<ThemeProvider theme={theme}>
			<Dashboard />
			{/* <Router>
				<Switch>
					<Route path="/users" component={Users} />
					<Route path="/" component={Dashboard} />
				</Switch>
			</Router> */}
		</ThemeProvider>
	);
}

export default App;
