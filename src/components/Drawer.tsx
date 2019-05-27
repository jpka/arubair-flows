import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
	Paper,
	TextField,
	createStyles,
	Theme,
	Typography,
	Chip,
	Avatar,
	InputAdornment,
	Button,
	ListItem,
	ListItemText,
	List
} from '@material-ui/core';
import {
	Close as CloseIcon, AccountCircle, CheckBox, NoteAdd as NoteAddIcon, CheckCircle
} from '@material-ui/icons';
import BaseNewOrder from './forms/NewOrder';

const styles = (theme: Theme) => ({
	container: {
	//   display: 'flex',
	//   flexWrap: 'wrap',
		margin: 10,
		padding: "20px",
		lineHeight: "75px"
	},
	wideField: {
	//   marginLeft: theme.spacing.unit,
	//   marginRight: theme.spacing.unit,
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
			marginLeft: "auto",
			marginRight: "auto",
			width: "80%"
	},
	header: {
			marginBottom: 15
	},
	listItem: {
			paddingLeft: 0
	}
});

// const NewOrder = withStyles(styles)((props: any) => {
// 		let {classes} = props;

// 		// const handleChange = (name) => (event: React.ChangeEvent<HTMLInputElement>) => {
// 		// 	setValues({ ...values, [name]: event.target.value });
// 		// };

// 		return (
				
// 		);
// });

const UserChip = ({name, pic}) => 
	<Chip 
		avatar={<Avatar src={`/imgs/profile/${pic}.png`}/>}
		label={name}
		onDelete={() => {}}
	/>;

const TaskEdit = withStyles(styles)(({classes}: any) => {
		return (
				<div>
						<Typography className={classes.header} variant="h6">Client questionnaire</Typography>
						<TextField
								id="assignee"
								label="Assigned to"
								className={classes.wideField}
								value="Juan Delgado"
								variant="outlined"
								InputProps={{
										startAdornment: (
												<InputAdornment position="start">
														<Avatar src="/imgs/profile/man.png"/>
												</InputAdornment>
										)
								}}
						/>
						<TextField
								id="notified"
								label="Subscribed"
								className={classes.wideField}
								variant="outlined"
								InputProps={{
										startAdornment: (
												<InputAdornment position="start">
														<Avatar style={{marginRight: 5}} src="/imgs/profile/girl.png"/>
														<Avatar src="/imgs/profile/boy.png"/>
												</InputAdornment>
										)
								}}
						/>
						<Typography variant="body1">Check the following items with the client</Typography>
						<List>
								<ListItem dense button className={classes.listItem}>
										<CheckBox color="primary" checked={true}/>
										<ListItemText>Item 1</ListItemText>
								</ListItem>
								<ListItem dense button className={classes.listItem}>
										<CheckBox color="primary" checked={true}/>
										<ListItemText>Item 2</ListItemText>
								</ListItem>
								<ListItem dense button className={classes.listItem}>
										<CheckBox color="primary" checked={false}/>
										<ListItemText>Item 3</ListItemText>
								</ListItem>
								<ListItem dense button className={classes.listItem}>
										<CheckBox color="primary" checked={false}/>
										<ListItemText>...</ListItemText>
								</ListItem>
						</List>
						<div style={{textAlign: "center"}}>
								<Button className={classes.button} variant="contained" color="secondary">
										Add note
										<NoteAddIcon style={{marginLeft: 10}} />
								</Button>
								<Button className={classes.button} style={{marginTop: "-10px"}} variant="contained" color="primary">
										Mark as finished
										<CheckCircle style={{marginLeft: 10}} />
								</Button>
						</div>
				</div>
		);
})

const NewOrder = withStyles(styles)(BaseNewOrder);

const Contents = withStyles(styles)((props: any) => {
	let {classes} = props;
	return (
		<Paper className={classes.container}>
			<NewOrder onSubmit={(values) => console.log(values)} />
			{/* <TaskEdit /> */}
		</Paper>
	);
});


const AppDrawer = (onClose, ...props) => {
		console.log(props["open"]);
		return (
				// <Drawer variant="persistent" anchor="left" {...props} open={true} PaperProps={{style: {
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
						<div style={{width: 300, display: "inline-block", float: "left", position: "relative"}}>
								<CloseIcon style={{position: "absolute", right: 25, top: 35}}/>
								<Contents/>
						</div>
				// </Drawer>
		);
}

export default withStyles(styles)(AppDrawer);