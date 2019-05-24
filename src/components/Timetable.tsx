import React from 'react';
import {
	colors,
	Chip,
	Avatar
} from '@material-ui/core';
import {
	Done as DoneIcon,
	Email as EmailIcon
} from '@material-ui/icons';
import { 
  Grid, 
  Table, 
  TableHeaderRow,
  TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui';
import { sample } from 'lodash';

const randomPic = () => `/imgs/profile/${sample(['boy', 'girl', 'man'])}.png`;

const Task = ({type, name, past, ...rest}) => {
	let style: any = {
		color: "#fff",
		fontWeight: "500"
	};
	let avatar;
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
	if (past) style.opacity = 0.7;
	return (
		<div>
			<Chip
			className={type}
			style={style}
			label={name}
			avatar={avatar}
			onDelete={() => {}}
			{...rest}
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

const dates = ["05/05", "10/05", "11/05", "13/05", "14/05", "15/05", "06/06", "07/06", "13/06", "14/06", "18/06", "19/06", "21/06"];

const onMount = (ref) => {
	let c = document.querySelector(".TableContainer-root-2"); 
	if (c) c.scroll({left: 600});
	let th = document.querySelector("th");
	if (th) th.className = th.className.replace("TableFixedCell-fixedCell-149 TableFixedCell-dividerRight-150", "");
};

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

const Timetable = () => {
	const task = (data, i) => {
		i = `t-${i}`;
		// data.onClick = () => onTaskClick(data);
		return data.past ? (<CompletedTask key={i} {...data}/>) : (<PendingTask key={i} {...data}/>);
	};

	return (
		<Grid
			rows={[
				{ 
				client: 'Perez, Juan', 
				type: "Import", 
				"11/05": {name: "Cotization sent", type: "alarm", past: true},
				"15/05": {name: "Cotization follow-up", type: "alarm"},
				"07/06": [{name: "Email 2 weeks before ship arrival", type: "automation"}, {name: "Documents check", type: "alarm"}],
				"14/06": {name: "Email 1 week before ship arrival", type: "automation"},
				"19/06": {name: "Customs documents", type: "alarm"}
				},
				{ 
				client: 'Smith, John', 
				type: "Export", 
				"05/05": {name: "Cotization sent", type: "alarm", past: true},
				"13/05": {name: "Cotization follow-up", type: "alarm", past: true},
				"07/06": [{name: "Email 2 weeks before job", type: "automation"}, {name: "Request empty container", type: "alarm"}],
				"14/06": {name: "Email 1 week before job", type: "automation"},
				"21/06": {name: "Customs documents", type: "alarm"}
				},
				{ 
				client: 'Rilke, Rainer', 
				type: "Import", 
				"10/05": {name: "Cotization sent", type: "alarm", past: true},
				"14/05": {name: "Cotization follow-up", type: "alarm", past: true},
				"06/06": [{name: "Email 2 weeks before ship arrival", type: "automation"}, {name: "Documents check", type: "alarm"}],
				"13/06": {name: "Email 1 week before ship arrival", type: "automation"},
				"18/06": {name: "Customs documents", type: "alarm"}
				}
			]}
			columns={[
				{ name: 'order', title: " ", getCellValue: row => (
				<div>
					<div style={{fontWeight: "bold", fontSize: "14px"}}>{row.client}</div>
					<div style={{fontStyle: "italic"}}>{row.type}</div>
				</div>
				)},
			].concat(
				dates.map((date, i) => ({name: date, title: date, getCellValue: row =>
				row[date] && (Array.isArray(row[date]) ? <div style={{lineHeight: 3}}>{row[date].map((d, j) => task(d, `${i}-${j}`))}</div> : task(row[date], i))
				}))
				
			)}>
			<Table 
				ref={onMount}
				columnExtensions={dates.map(date => ({columnName: date, width: 270}))} 
			/>
			<TableHeaderRow contentComponent={TableHeaderContent} />
			<TableFixedColumns
				leftColumns={["order"]}
			/>
		</Grid>
	);
}

export default Timetable;