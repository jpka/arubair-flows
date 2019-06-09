import React from "react";
import {
	Typography,
	// TextField,
	// Select,
	MenuItem,
	FormControl,
	InputLabel,
	OutlinedInput,
	Button,
	InputAdornment
} from "@material-ui/core";
import { 
	Form,
	TextField,
	Select,
	makeForm,
	Title
} from './components';
// import { Field } from 'formik'
import * as Yup from 'yup';

const schema = Yup.object().shape({
	cotization: Yup.number().required()
});

export default makeForm({validationSchema: schema}, ({classes, values, title, isValid}: any) => {
	return (
		<Form>
			<Title classes={classes}>{title}</Title>
			<TextField
				name="cotization"
				label="Cotization"
				type="number"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
				InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
			/>
			<Button 
				type="submit"
				disabled={!isValid} 
				className={classes.button} 
				variant="contained" 
				color="primary">Add</Button>
		</Form>
	);
});