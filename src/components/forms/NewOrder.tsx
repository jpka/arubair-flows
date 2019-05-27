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
	Select
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

const NewOrder = ({classes, onSubmit, values}: any) => {
	return (
		<Form onSubmit={onSubmit} validationSchema={schema}>
			<Typography className={classes.header} variant="h6">New order</Typography>
			{/* <Field name="clientName" component={() => */}
			<TextField
				required
				name="client.name"
				label="Client name"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			{/* }/> */}
			<Select 
				className={classes.wideField}
				name="type" 
				label="Type"
				labelWidth={40} 
				variant="outlined" 
				required={true} 
				options={["Import", "Export", "Other"]} 
			/>
			{/* <FormControl variant="outlined" className={classes.wideField}>
				<InputLabel htmlFor="type">Type</InputLabel>
				<Select
					required
					input={
						<OutlinedInput
							value="Import"
							labelWidth={40}
							name="type"
							id="type"
						/>
					}
				>
					<MenuItem value="Import">Import</MenuItem>
					<MenuItem value="Export">Export</MenuItem>
				</Select>
			</FormControl> */}
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
			<div style={{textAlign: "center"}}>
				<Button 
					type="submit"
					disabled={false} 
					style={{width: "100%"}} 
					className={classes.button} 
					variant="contained" 
					color="primary">Add</Button>
			</div>
		</Form>
	);
};

export default NewOrder;