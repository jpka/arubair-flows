import React, { useState } from 'react';
import { 
	colors,
	Paper,
} from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import AppBar from './AppBar';
import Drawer from './Drawer';
import Timetable from './Timetable';

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

const App: React.FC = () => {
	const [drawerOpen, setDrawerState] = useState(true);
	// const setDrawerState = (state) => {};
	// const drawe
	return (
			<MuiThemeProvider theme={theme}>
				<Paper>
					<AppBar position="fixed" onAdd={() => setDrawerState(true)} />
				</Paper>
				<Drawer open={drawerOpen} onClose={() => setDrawerState(false)} />
				<div style={{
					display: "inline-block", 
					background: "#424348", 
					padding: 10,
					// width: "calc(100% - 20px)",
					paddingLeft: 0,
					width: "calc(100% - 310px)"
				}}>
					<Paper>
						<Timetable />
					</Paper>
				</div>
			</MuiThemeProvider>
	);
}

export default App;
