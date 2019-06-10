import React from "react";
import {
	Typography,
	// TextField,
	// Select,
	MenuItem,
	FormControl,
	InputLabel,
	OutlinedInput,
	Button
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

const schema = Yup.object().shape({
	name: Yup.string()
		.required('Required'),
	email: Yup.string()
		.email('Invalid email')
		.required('Required')
});

export default makeForm(
	{validationSchema: schema}, 
	({classes, title, isValid, submitText}: any) => {
	return (
		<Form>
			<Typography className={classes.header} variant="h6">{title}</Typography>
			<TextField
				required
				name="name"
				label="Name"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			<TextField
				required
				name="email"
				label="Email"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			<Button 
				type="submit"
				disabled={!isValid} 
				className={classes.button} 
				variant="contained" 
				color="primary">{submitText}</Button>
			{/* {error && <Error>There has been an error, check your connection and try again</Error>} */}
		</Form>
	);
});