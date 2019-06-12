import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
	Paper,
	Theme,
	Chip,
	Avatar,
	Drawer
} from '@material-ui/core';
import {
	Close as CloseIcon, AccountCircle, CheckBox, NoteAdd as NoteAddIcon, CheckCircle
} from '@material-ui/icons';
import { connect } from 'react-redux';
// import { bindActionCreators, combineReducers } from 'redux';
import { 
	actions as ordersActions
} from '../modules/orders';
import { 
	actions as usersActions
} from '../modules/users';
import { 
	actions as uiActions
} from '../modules/ui';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '../index';
import BaseOrderForm from './forms/Order';
import BaseTaskForm from './forms/Task';
import BaseUser from './forms/User';

export const styles = (theme: Theme) => ({
	container: {
	//   display: 'flex',
	//   flexWrap: 'wrap',
		margin: 10,
		padding: "20px",
		lineHeight: "75px"
	},
	wideField: {
	//   marginLeft: theme.spacing(1),
	//   marginRight: theme.spacing(1),
		marginLeft: "auto",
		marginRight: "auto",
		width: "100%",
	//   marginTop: 15
	},
	dense: {
		marginTop: 19,
	},
	menu: {
		width: 300,
	},
	button: {
		width: "100%"
	},
	header: {
		marginBottom: 15
	},
	listItem: {
		paddingLeft: 0
	}
});

// const UserChip = ({name, pic}) => 
// 	<Chip 
// 		avatar={<Avatar src={`/imgs/profile/${pic}.png`}/>}
// 		label={name}
// 		onDelete={() => {}}
// 	/>;

// const connectTaskForm = (form) => {
// 	connect(
// 		({orders}: State, {id}: any) => ({ initialValues: orders.tasks[id] }),
// 		(dispatch: ThunkDispatch<any, any, any>, {orderId, taskId}) => ({ 
// 			onSubmit: (values) => dispatch(ordersActions.task.modify(orderId, taskId, values)),
// 			title: "Cotization",
// 			submitText: "Save"
// 		})
// 	)(withStyles(styles)(form))
// };

const viewsMap = {
	newOrder: connect(
		null,
		(dispatch: ThunkDispatch<any, any, any>) => ({
			onSubmit: (values) => dispatch(ordersActions.order.add(values)),
			title: "New order",
			submitText: "Add"
		})
	)(withStyles(styles)(BaseOrderForm)),
	editOrder: connect(
		({orders}: State, {orderId}: any) => ({ initialValues: orders.orders[orderId] }),
		(dispatch: ThunkDispatch<any, any, any>, {orderId}) => ({ 
			onSubmit: (values) => dispatch(ordersActions.order.modify(orderId, values)),
			title: "Edit order",
			submitText: "Save",
			edit: true
		})
	)(withStyles(styles)(BaseOrderForm)),
	editTask: connect(
		({orders, users}: State, {taskId}: any) => ({ task: orders.tasks[taskId], users: users.users }),
		(dispatch: ThunkDispatch<any, any, any>, {orderId, taskId}) => ({ 
			onSubmit: (values) => dispatch(ordersActions.task.modify(orderId, taskId, values)),
			sendEmails: () => dispatch(ordersActions.task.sendEmails(orderId, taskId))
		})
	)(withStyles(styles)(BaseTaskForm)),
	newUser: connect(
		// ({users}: State) => ({ error: users.error }),
		null,
		(dispatch: ThunkDispatch<any, any, any>) => ({
			onSubmit: (values) => dispatch(usersActions.createUser(values)),
			title: "New user",
			submitText: "Create"
		})
	)(withStyles(styles)(BaseUser))
};

// const Contents = withStyles(styles)(({classes}: any) => {
// 	return (
// 		<Paper className={classes.container}>
// 			<OrderForm />
// 			{/* <TaskEdit /> */}
// 		</Paper>
// 	);
// });

const AppDrawer = connect(
	null,
	({close: uiActions.closeDrawer})
)(withStyles(styles)(({view, params, classes, close, ...props}: any) => {
	const View = viewsMap[view];

	// PaperProps={{style: {
		//     top: "64px",
		//     // background: colors.orange[700],
		//     // background: "rgb(149, 152, 161) none repeat scroll 0% 0%",
		//     background: "rgb(66, 67, 72) none repeat scroll 0% 0%"
		// }}}>
				// {/* <div style={{display: 'flex',
				//     alignItems: 'center',
				//     // padding: '0 8px',
				//     // ...theme.mixins.toolbar,
				//     justifyContent: 'flex-end'
				// }}>
				//     <IconButton onClick={onClose}>
				//         <CloseIcon />
				//     </IconButton>
				// </div> */}

	return (
		// <Drawer variant="persistent" anchor="left" {...props} open={true}>
			<div style={{width: 300, display: "inline-block", float: "left", position: "relative"}}>
				<CloseIcon onClick={close} style={{position: "absolute", right: 25, top: 35}} />
				{/* <Contents {...params}/> */}
				<Paper className={classes.container}>
					<View {...params} />
				</Paper>
			</div>
		// </Drawer>
	);
}));

export default withStyles(styles)(AppDrawer);