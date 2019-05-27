import React from 'react';
import { 
	TextField as MTextField,
	FormControl,
	InputLabel,
	Select as MSelect,
	MenuItem,
	OutlinedInput
} from '@material-ui/core';
import { 
	Formik, 
	Field, 
	Form as FForm, 
	FormikValues
} from 'formik';

// interface FormProps {
// 	handleSubmit: () => void,
// 	props: 
// }

export const Form: React.FC<FormikValues> = ({children, initialValues, onSubmit, ...props}) => {
	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit} {...props}>
			{({handleSubmit, ...props}) => (
				<FForm>
					{children}
				</FForm>
			)}
		</Formik>
	);
}

export const TextField = ({name, ...props}) => {
	return (
		<Field name={name} render={({field}) =><MTextField {...field} {...props} />}/>
	);
}

export const Select = ({name, label, labelWidth, options, required, ...props}) => {
	const id = `${name}-field`;
	return (
		<Field name={name} render={({field}) => (
			<FormControl {...props}>
				<InputLabel htmlFor={id}>{label}</InputLabel>
				<MSelect
					value={field.value || ""}
					input={ <OutlinedInput required={required} id={id} {...field} labelWidth={labelWidth}/> }
				>
					{Object.keys(options).map(k => (
						<MenuItem key={k} value={Array.isArray(options) ? options[k] : k}>{options[k]}</MenuItem>)
					)}
				</MSelect>
			</FormControl>
		)}/>
	);
}

export const makeForm = ({initialValues, ...props}) => {
	return (component) => (
		<Formik onSubmit={onSubmit} initialValues={initialValues} {...props}>
			
		</Formik>
	);
}