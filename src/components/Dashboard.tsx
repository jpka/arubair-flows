import React, { Fragment } from 'react';
import { 
	Paper, withStyles
} from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

import AppBar from './AppBar';
import Drawer, { styles as drawerStyles } from './Drawer';
import {
	Users
} from '../index';
import Timetable from './Timetable';
import LoginForm from './Login';
// import BaseUserForm from './forms/User';
import { actions as usersActions } from '../modules/users';

interface DashboardProps {
	ui: any
}

const MainContainer = ({drawer, width, children, padding}) => {
	if (!width) width = "100%";
	return (
		<div style={{
			display: drawer ? "inline-block" : "block", 
			// background: "#424348", 
			padding: 10,
			width: drawer ? `calc(${width} - 310px)` : `calc(${width} - 20px)`,
			paddingLeft: drawer ? 0 : 10,
			margin: "0 auto"
		}}>
			<Paper>
				<div style={{padding: padding}}>
					{children}
				</div>
			</Paper>
		</div>
	)
}
// const NewUser = connect(
// 	// ({users}: State) => ({ error: users.error }),
// 	null,
// 	(dispatch: ThunkDispatch<any, any, any>) => ({
// 		onSubmit: (values) => dispatch(usersActions.createUser(values)),
// 		title: "New user",
// 		submitText: "Create"
// 	})
// )(withStyles(drawerStyles)(BaseUserForm));
// const Login = connect(
// 	// ({users}: State) => ({ error: users.error }),
// 	null,
// 	(dispatch: ThunkDispatch<any, any, any>) => ({
// 		onSubmit: (values) => { console.log(values); dispatch(usersActions.login(values)); },
// 		title: "New user",
// 		submitText: "Create"
// 	})
// )(withStyles(drawerStyles)(LoginForm));

const Dashboard: React.FC<DashboardProps> = ({ ui }) => {	
	return (
		<Fragment>
			<Paper>
				<AppBar position="fixed" onAdd={() => false} />
			</Paper>
			{ui.drawer && <Drawer onClose={() => false} {...ui.drawer} />}
			{/* <Drawer onClose={() => false} {ui.drawer && ...ui.drawer} /> */}
			{/* <Paper> */}
				<Router>
					<Switch>
						{/* <div style={{
							display: "inline-block", 
							background: "#424348", 
							padding: 10,
							width: ui.drawer ? "calc(100% - 310px)" : "calc(100% - 20px)",
							paddingLeft: ui.drawer ? 0 : 10,
							// width: "calc(100% - 310px)"
						}}> */}
						{/* <Route path="/login" render={() => 
							<MainContainer width="300px" padding="20px 30px" drawer={ui.drawer}>
								<Login />
							</MainContainer> 
						} /> */}
						{/* <Route path="/users" component={Users} /> */}
						{/* <Route path="/add-user" render={() => 
							<MainContainer width="300px" padding="20px" drawer={ui.drawer}>
								<NewUser />
							</MainContainer> 
						} /> */}
						<Route path="/" render={() => <MainContainer width="100%" padding="0" drawer={ui.drawer}><Timetable /></MainContainer>} />
					</Switch>
				</Router>
			{/* </Paper> */}
		</Fragment>
	);
}

export default Dashboard;
