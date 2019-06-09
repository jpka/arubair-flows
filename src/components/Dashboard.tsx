import React, { Fragment } from 'react';
import { 
	Paper
} from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppBar from './AppBar';
import Drawer from './Drawer';
import {
	Users
} from '../index';
import Timetable from './Timetable';
import Login from './Login';

interface DashboardProps {
	ui: any
}

const Dashboard: React.FC<DashboardProps> = ({ ui }) => {	
	return (
		<Fragment>
			<Paper>
				<AppBar position="fixed" onAdd={() => false} />
			</Paper>
			{ui.drawer && <Drawer onClose={() => false} {...ui.drawer} />}
			<div style={{
				display: "inline-block", 
				background: "#424348", 
				padding: 10,
				width: ui.drawer ? "calc(100% - 310px)" : "calc(100% - 20px)",
				paddingLeft: ui.drawer ? 0 : 10,
				// width: "calc(100% - 310px)"
			}}>
				<Paper>
					<Router>
						<Switch>
							<Route path="/login" component={Login} />
							<Route path="/users" component={Users} />
							<Route path="/" component={Timetable} />
						</Switch>
					</Router>
				</Paper>
				{/* <Paper>
					<Users />
				</Paper> */}
			</div>
		</Fragment>
	);
}

export default Dashboard;
