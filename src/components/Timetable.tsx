import React, { FC } from 'react';
import {
	colors,
	Chip,
	Avatar,
	Fab
} from '@material-ui/core';
import {
	Done as DoneIcon,
	Email as EmailIcon,
	Add as AddIcon,
	Cancel as CancelIcon,
	RemoveCircle,
	EventNoteOutlined
} from '@material-ui/icons';
import { 
  Grid, 
  Table, 
  TableHeaderRow,
  TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui';
// import { sample } from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
	useStyles
} from './App';
import {
	actions as uiActions
} from '../modules/ui';
import {
	actions as ordersActions,
	Order,
	statuses
} from '../modules/orders';
import { State } from '..';

const sample = (arr) => arr[0];
const randomPic = () => `/imgs/profile/${sample(['boy', 'girl', 'man'])}.png`;

const Task = ({type, label, past, onDelete, openDetails, status, ...rest}) => {
	let style: any = {
		color: "#fff",
		fontWeight: "500"
	};
	let avatar;
	const completed = status === statuses.completed;
	switch (type) {
		case "alarm":
			Object.assign(style, {
				backgroundColor: colors.red[500]
			});
			avatar = <Avatar src={randomPic()}/>;
			break;
		case "automation":
			Object.assign(style, {
				backgroundColor: colors.orange[400]
			});
			avatar = <Avatar style={{
				backgroundColor: colors.orange[600],
				color: colors.grey[700]
			}}><EmailIcon /></Avatar>;
			break;
	};
	if (completed) style.opacity = 0.7;
	return (
		<div>
			<Chip
				className={type}
				style={style}
				label={label}
				avatar={avatar}
				onClick={openDetails}
				onDelete={completed ? () => {} : onDelete}
				deleteIcon={completed ? <DoneIcon /> : <CancelIcon />}
				// {...rest}
			>
			</Chip>
		</div>
	);
};
const CompletedTask = (props) => <Task deleteIcon={<DoneIcon />}  {...props} />;
const PendingTask = (props) => <Task {...props} />;
// const task = (data) => <Task {...data}/>;

const DateHeader = ({date}) => (
	<h2>{date}</h2>
);

// const dates = ["05/05", "10/05", "11/05", "13/05", "14/05", "15/05", "06/06", "07/06", "13/06", "14/06", "18/06", "19/06", "21/06"];

// const onMount = (ref) => {
// 	let c = document.querySelector(".TableContainer-root-2"); 
// 	if (c) c.scroll({left: 600});
// 	let th = document.querySelector("th");
// 	if (th) th.className = th.className.replace("TableFixedCell-fixedCell-149 TableFixedCell-dividerRight-150", "");
// };

// const getDates = () => {
// 	moment();

// }

const TableHeaderContent = ({
	column, children, classes, ...restProps
	}) => (
	<TableHeaderRow.Content
		column={column}
		{...restProps}
	>
		<div style={{fontSize: 18, color: "#424348", fontWeight: "normal"}}>{children}</div>
	</TableHeaderRow.Content>
);

const TasksCell = connect(
	({orders}: State, {orderId, date}: any) => ({tasks: orders.orderedTasks[date] && orders.orderedTasks[date][orderId], orderId}),
	// dispatch => bindActionCreators({ removeTask: ordersActions.task.remove, editOrder: uiActions.editOrder }, dispatch)
)(({tasks, orderId, dispatch}: any) => {
	return tasks ? (
		<div style={{lineHeight: 3}}>
			{tasks.map((task: any, i) => (
				<Task 
					key={i.toString()} 
					openDetails={() => dispatch(uiActions.openDrawer("editTask", {orderId, taskId: task.id, variant: task.status === 'overdue' ? "attention" : "none"}))}
					onDelete={() => dispatch(ordersActions.task.remove(orderId, task.id))}
					
					{...task}
				/>
			))}
		</div>
	) : null;
});

const actionStyle = {
	cursor: "pointer"
};

const ActionsCell = connect(
	null,
	// dispatch => bindActionCreators({ removeOrder: ordersActions.order.remove }, dispatch)
)(({orderId, dispatch}: any) => {
	return (
		<React.Fragment>
			<div><EventNoteOutlined fontSize="small" style={actionStyle} onClick={() => dispatch(uiActions.editOrder(orderId))}/></div>
			<div><RemoveCircle fontSize="small" style={actionStyle} onClick={() => dispatch(ordersActions.order.remove(orderId))} /></div>
		</React.Fragment>
	);
});

const Timetable = connect(
	({orders}: State) => ({ orders: orders.orders, dates: orders.dates }),
	dispatch => bindActionCreators({ newOrder: uiActions.newOrder }, dispatch)
)(({orders, dates, newOrder}: {orders: any, dates: any[], newOrder: () => void}) => {
	const classes = useStyles();
	const task = (data, i) => {
		i = `t-${i}`;
		// data.onClick = () => onTaskClick(data);
		return data.past ? (<CompletedTask key={i} {...data}/>) : (<PendingTask key={i} {...data}/>);
	};

	let columns = [
		{ name: 'order', title: " ", getCellValue: row => (
			<React.Fragment>
				<div style={{fontWeight: "bold", fontSize: "14px"}}>{row.client.name}</div>
				<div style={{fontStyle: "italic"}}>{row.type}</div>
			</React.Fragment>
		)},
		{name: 'actions', title: " ", getCellValue: row => <ActionsCell orderId={row.id} />}
	];

	console.log("RENDER TIMETABLE")

	if (dates.length > 1) {
		columns = columns.concat(
			dates.map((date, i) => ({
				name: date, 
				title: moment().dayOfYear(date).format('DD[/]MM[/]YY'),
				getCellValue: row => <TasksCell key={`${row.id}-${date}`} orderId={row.id} date={date} />
					// row.tasks && row.tasks[date] && (
					// 	Array.isArray(row.tasks[date])
					// 	? 
					// 	<div style={{lineHeight: 3}}>
					// 		{row.tasks[date].map((d, j) => task(d, `${i}-${j}`))}
					// 	</div>
					// 	: 
					// 	task(row.tasks[date], i)
					// )
				})
			)	
		);
	}

	return (
		<div style={{position: "relative"}}>
			<Grid
				rows={Object.values(orders)}
				RootProps={{style:{width: 3000}}}
				// rows={[
				// 	{ 
				// 		client: 'Perez, Juan', 
				// 		type: "Import", 
				// 		"11/05": {name: "Cotization sent", type: "alarm", past: true},
				// 		"15/05": {name: "Cotization follow-up", type: "alarm"},
				// 		"07/06": [{name: "Email 2 weeks before ship arrival", type: "automation"}, {name: "Documents check", type: "alarm"}],
				// 		"14/06": {name: "Email 1 week before ship arrival", type: "automation"},
				// 		"19/06": {name: "Customs documents", type: "alarm"}
				// 	},
				// 	{ 
				// 		client: 'Smith, John', 
				// 		type: "Export", 
				// 		"05/05": {name: "Cotization sent", type: "alarm", past: true},
				// 		"13/05": {name: "Cotization follow-up", type: "alarm", past: true},
				// 		"07/06": [{name: "Email 2 weeks before job", type: "automation"}, {name: "Request empty container", type: "alarm"}],
				// 		"14/06": {name: "Email 1 week before job", type: "automation"},
				// 		"21/06": {name: "Customs documents", type: "alarm"}
				// 	},
				// 	{ 
				// 		client: 'Rilke, Rainer', 
				// 		type: "Import", 
				// 		"10/05": {name: "Cotization sent", type: "alarm", past: true},
				// 		"14/05": {name: "Cotization follow-up", type: "alarm", past: true},
				// 		"06/06": [{name: "Email 2 weeks before ship arrival", type: "automation"}, {name: "Documents check", type: "alarm"}],
				// 		"13/06": {name: "Email 1 week before ship arrival", type: "automation"},
				// 		"18/06": {name: "Customs documents", type: "alarm"}
				// 	}
				// ]}
				columns={columns}>
				<Table
					RootProps={{style:{width: 3000}}}
					// noDataCellComponent={{getMessage: () => "No workflows"}}
					// ref={onMount}
					columnExtensions={
						dates.map(date => ({columnName: date, width: 270})).concat([
							//@ts-ignore
							{columnName: 'order', width: 150, wordWrapEnabled: true},
							{columnName: 'actions', width: 50}
						])
					}
				/>
				<TableHeaderRow contentComponent={TableHeaderContent} />
				<TableFixedColumns
					leftColumns={["order", "actions"]}
				/>
				<Fab 
					color="primary"
					className={classes.middleBottomFab}
					size="medium" 
					aria-label="Add"
					onClick={newOrder}
				>
					<AddIcon />
				</Fab>
			</Grid>
		</div>
	);
});

export default Timetable;