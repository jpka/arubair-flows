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
	DateTimePicker,
	makeForm
} from './components';
// import { Field } from 'formik'
import * as Yup from 'yup';

const schema = Yup.object().shape({
	client: Yup.object().shape({
		name: Yup.string()
			.required('Required'),
		email: Yup.string()
			.email('Invalid email')
			.required('Required')
	}),
	type: Yup.string().required()
});

const OrderForm = makeForm(
	{validationSchema: schema}, 
	({classes, title, isValid, submitText, ...props}: any) => {
	return (
		<Form>
			<Typography className={classes.header} variant="h6">{title}</Typography>
			<TextField
				required
				name="client.name"
				label="Client name"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			<Select 
				className={classes.wideField}
				name="type" 
				label="Type"
				labelWidth={40} 
				variant="outlined" 
				required={true} 
				options={{import: "Import", export: "Export", other: "Other"}}
			/>
			<TextField
				required
				name="client.email"
				label="Email"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			<TextField
				name="client.address"
				label="Address"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			<TextField
				name="client.phoneNumber"
				label="Phone number"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			{/* {props.edit && <DateTimePicker 
				name="jobDate" 
				label="Job date" 
				classes={classes} 
				variant="outlined" 
			/>} */}
			{/* <div style={{textAlign: "center"}}> */}
				<Button 
					type="submit"
					disabled={!isValid} 
					className={classes.button} 
					variant="contained" 
					color="primary">{submitText}</Button>
			{/* </div> */}
		</Form>
	);
});

export default OrderForm;