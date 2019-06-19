import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import {
	Form,
	TextField,
	makeForm
} from './components';
import * as Yup from 'yup';

export default makeForm({ 
	validationSchema: Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Required'),
		password: Yup.string().required('Required')
	}),
	// ...props,
}, ({classes, values, isValid, onSubmit}: any) => {
	return (
		<Form>
			<TextField
				name="email"
				label="Email"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			<TextField
				name="password"
				type="password"
				label="Password"
				className={classes.wideField}
				margin="normal"
				variant="outlined"
			/>
			<Button 
				type="submit"
				disabled={!isValid} 
				className={classes.button} 
				variant="contained"
				style={{marginTop: "20px"}}
				color="primary">
				Login
			</Button>
		</Form>
	)
});