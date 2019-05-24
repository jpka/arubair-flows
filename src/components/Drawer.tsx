import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
import {
		IconButton,
		Paper,
		TextField,
		FormControl,
		FormControlLabel,
		Select,
		Input,
		InputLabel,
		MenuItem,
		withStyles,
		createStyles,
		Theme,
		Typography,
		colors,
		Chip,
		Avatar,
		InputAdornment,
		Button,
		OutlinedInput,
		ListItem,
		ListItemText,
		List,
		Icon
} from '@material-ui/core';
import {
		Close as CloseIcon, AccountCircle, CheckBox, NoteAdd as NoteAddIcon, CheckCircle
} from '@material-ui/icons';
// import Button from '@material-ui/core/Button';
// import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import MailIcon from '@material-ui/icons/Mail';

const styles = (theme: Theme) =>
	createStyles({
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

const NewOrder = withStyles(styles)((props: any) => {
		let {classes} = props;

		// const handleChange = (name) => (event: React.ChangeEvent<HTMLInputElement>) => {
		// 	setValues({ ...values, [name]: event.target.value });
		// };

		return (
				<form>
						<Typography className={classes.header} variant="h6">New order</Typography>
						<TextField
							required
							id="client-name"
							label="Client name"
							className={classes.wideField}
							margin="normal"
							variant="outlined"
						/>
						{/* <FormControl className={classes.wideField}>
								<InputLabel htmlFor="type-helper">Type</InputLabel>
								<Select
										name="type"
										variant="outlined"

										input={<Input name="type" id="type-helper"/>}
								>
										<MenuItem value="import">Import</MenuItem>
										<MenuItem value="export">Export</MenuItem>
								</Select>
						</FormControl> */}
						<FormControl variant="outlined" className={classes.wideField}>
							<InputLabel
									// ref={ref => {
									// this.InputLabelRef = ref;
									// }}
									htmlFor="type"
							>
								Type
							</InputLabel>
							<Select
								required
								input={
									<OutlinedInput
											labelWidth={40}
											name="type"
											id="type"
									/>
								}
							>
									<MenuItem value="Import">Import</MenuItem>
									<MenuItem value="Export">Export</MenuItem>
							</Select>
						</FormControl>
						<TextField
							required
							id="email"
							label="Email"
							className={classes.wideField}
							margin="normal"
							variant="outlined"
						/>
						<TextField
							id="address"
							label="Address"
							className={classes.wideField}
							margin="normal"
							variant="outlined"
						/>
						<TextField
							id="phone-number"
							label="Phone number"
							className={classes.wideField}
							margin="normal"
							variant="outlined"
						/>
						<div style={{textAlign: "center"}}>
								<Button disabled={true} style={{width: "100%"}} className={classes.button} variant="contained" color="primary">Add</Button>
						</div>
				</form>
		);
});

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

const Contents = withStyles(styles)((props: any) => {
		let {classes} = props;
		return (
				<Paper className={classes.container}>
						<NewOrder />
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