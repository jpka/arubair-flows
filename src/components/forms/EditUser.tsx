import React, { useState, useEffect } from "react";
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
	Error,
	FileInput,
	ProgressButton
} from './components';
import {
	getDataURL
} from '../../utils';
// import { Field } from 'formik'
import * as Yup from 'yup';
import { AccountCircle } from "@material-ui/icons";
import { FormikProps } from "formik";

const schema = Yup.object().shape({
	name: Yup.string()
		.required('Required'),
	// email: Yup.string()
	// 	.email('Invalid email')
	// 	.required('Required')
});

export default makeForm(
	{validationSchema: schema}, 
	({classes, isValid, values, updating}: FormikProps<any> & {classes: any, updating: any}) => {
	let [avatar, setAvatar] = useState();

	useEffect(() => {
		if (values.avatar) {
			if (typeof values.avatar === "object") {
				console.log(values.avatar);
				getDataURL(values.avatar).then(setAvatar);
			} else if (typeof values.avatar === "string") {
				setAvatar(values.avatar);
			}
		}
	});

	// if (values.avatar && typeof values.avatar === "object") isValid = true;

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
					startAdornment: <FileInput name="avatar">
						<Avatar src={avatar}>
							{!avatar && <AccountCircle />}
						</Avatar>
					</FileInput>
				}}
			/>
			<ProgressButton 
				type="submit"
				inProgress={updating}
				isValid={isValid}
				className={classes.button} 
				variant="contained" 
				color="primary"
			>
				Save
			</ProgressButton>
			{/* {error && <Error>There has been an error, check your connection and try again</Error>} */}
		</Form>
	);
});