import React from "react";
import {
	Typography,
	InputAdornment,
	Button,
	Avatar
} from "@material-ui/core";
import { 
	Form,
	TextField,
	Select,
	makeForm,
	Error
} from './components';
// import { Field } from 'formik'
import * as Yup from 'yup';
import { AccountCircle } from "@material-ui/icons";

const schema = Yup.object().shape({
	name: Yup.string()
		.required('Required'),
	email: Yup.string()
		.email('Invalid email')
		.required('Required')
});

export default makeForm(
	{validationSchema: schema}, 
	({classes, isValid, values}: any) => {
	return (
		<Form>
			<Typography className={classes.header} variant="h6">Edit user</Typography>
			<TextField
				required
				name="name"
				label="Name"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
				InputProps={{
					startAdornment: <Avatar>
						<AccountCircle />
					</Avatar>
				}}
			/>
			<Button 
				type="submit"
				disabled={!isValid} 
				className={classes.button} 
				variant="contained" 
				color="primary">Save</Button>
			{/* {error && <Error>There has been an error, check your connection and try again</Error>} */}
		</Form>
	);
});