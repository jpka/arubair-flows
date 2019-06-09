import React, { FC } from 'react';
import {
	Avatar,
	Fab,
	TextField
} from '@material-ui/core';
import {
	AccountCircle,
	Add as AddIcon
} from '@material-ui/icons';
import { 
  Grid, 
  Table, 
  TableHeaderRow,
  // TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui';
import {
	CenterText
} from './Misc';
import {
	User,
	UsersState
} from '../modules/users';

interface UsersProps {
	users: UsersState,
  addUser: () => void
}

// const InputCell = () => {
// 	return (
// 		<TextField
// 			// className={classes.wideField}
// 			margin="normal"
// 			variant="outlined"
// 		/>
// 	);
// }

const Users: FC<UsersProps> = ({users, addUser}) => {
	return (
		<div style={{position: "relative"}}>
			<Grid
				rows={users.users}
				columns={[
					{ name: 'profilePic', title: "Picture", getCellValue: row => <Avatar><AccountCircle/></Avatar>},
					{ name: 'name', title: "Name", getCellValue: row => <CenterText>{row.name}</CenterText> },
					{ name: 'email', title: "Email", getCellValue: row => <CenterText>{row.email}</CenterText>}
					// { name: 'Admin', title: "Name", getCellValue: row => <Avatar><AccountCircle /></Avatar> },
				]}>
				<Table
					style={{padding: "10px 0"}}
					// ref={onMount}
					// columnExtensions={dates.map(date => ({columnName: date, width: 270}))} 
					columnExtensions={[{columnName: 'profilePic', width: 80}]}
				/>
				<TableHeaderRow style={{textAlign: 'center'}} />
				{/* <TableFixedColumns
					leftColumns={["order"]}
				/> */}
				<Fab 
					color="primary" 
					style={{
						position: "absolute",
						left: "50%",
						marginLeft: -24,
						bottom: -24
					}} size="medium" aria-label="Add"
					onClick={addUser}
				>
					<AddIcon />
				</Fab>
			</Grid>
		</div>
	)
}

export default Users;