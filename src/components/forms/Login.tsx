import React, { FC } from 'react';
import { Paper, Button } from '@material-ui/core';
import {
	Form,
	TextField,
	makeForm
} from './components';

export default makeForm({ 
	// validationSchema: Yup.object().shape({
		
	// }),
	// ...props,
}, ({classes, values, isValid, login}: any) => {
	return (
		<Form>
			<TextField name="user" />
			<TextField name="password" type="password" />
			<Button variant="contained">Login</Button>
		</Form>
	)
});