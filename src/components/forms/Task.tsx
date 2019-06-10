import React from "react";
import {
	Button,
	InputAdornment,
	FormGroup
} from "@material-ui/core";
// import {
// 	ListItem
// } from "@material-ui/icons";
import * as Yup from 'yup';
// import { connect } from 'react-redux';

import { 
	Form,
	Title,
	TextField,
	DateTimePicker,
	EmailCheckList,
	makeForm,
	SubTitle,
	Checkbox,
	RadioGroup,
	SendEmailButton as OGSendEmailButton,
	Select
} from './components';
import {
	Task,
	utils,
	actions as ordersActions
} from "../../modules/orders";

const SendEmailButton = (props) => {
	console.log("send email button values", props.values);
	return <OGSendEmailButton 
		className={props.className}
		send={props.sendEmails}
		status={props.values.emails && props.values.emails.status}
		sentTimes={props.values.emails && props.values.emails.sentTimes}
	/>;
}

const schema = {
	label: Yup.string().required('Required'),
	due: Yup.date().required('Required')
};

const schemas = {
	emailedList: Yup.object().shape({
		email: Yup.string().email().required(),
		answered: Yup.boolean().required()
	})
};

const taskFragments = {
	importCotizationConfirmation: {
		schema: {
			cotization: Yup.number()
		},
		Fragment: ({classes}) => (
			<React.Fragment>
				<TextField
					name="data.cotization"
					label="Cotization"
					className={classes.wideField}
					margin="normal"
					variant="outlined"
					type="number"
					InputProps={{
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
					}}
				/>
			</React.Fragment>
		)
	},
	exportPricesRequest: {
		schema: {
			prices: Yup.object().shape({
				freights: schemas.emailedList,
				agents: schemas.emailedList
			})
		},
		initialValues: {prices: {
			freights: [],
			agents: []
		}},
		Fragment: ({classes, values,...props}) => {
			// if (!values.prices) values.prices = {
			// 	freights: [],
			// 	agents: []
			// }
			return (
				<React.Fragment>
					<EmailCheckList title="Freight companies" name="emails.list[0].recipients" classes={classes} />
					<TextField name="emails.list[0].subject" label="Email subject" variant="outlined" />
					<TextField name="emails.list[0].body" label="Email body" variant="outlined" multiline />
					<EmailCheckList title="Agents in destination companies" name="emails.list[1].recipients" classes={classes} />
					<TextField name="emails.list[1].subject" label="Email subject" variant="outlined" />
					<TextField name="emails.list[1].body" label="Email body" variant="outlined" multiline />
					<SendEmailButton className={classes.button} values={values} {...props} />
					{/* <Button onClick={() => dispatch({type: uiact}) } /> */}
				</React.Fragment>
			);
		}
	},
	exportCotizationConfirmation: {
		schema: {
			prices: Yup.object().shape({
				freights: schemas.emailedList,
				agents: schemas.emailedList
			})
		},
		Fragment: ({classes, values}) => {
			// if (!values.prices) values.prices = {
			// 	freights: [],
			// 	agents: []
			// }
			if (values.data && values.data.cotizationSent) values.data.cotizationSent = values.data.cotizationSent.toString();
			return (
				<React.Fragment>
					<FormGroup row>
						<SubTitle classes={classes}>Cotization sent?</SubTitle>
						<RadioGroup name="data.cotizationSent" options={[["Yes", true], ["No", false]]} />
					</FormGroup>
					{values.data && values.data.cotizationSent === "true" && (
						<TextField
							name="data.cotization"
							label="Cotization"
							className={classes.wideField}
							margin="normal"
							variant="outlined"
							type="number"
							InputProps={{
								startAdornment: <InputAdornment position="start">$</InputAdornment>,
							}}
						/>
					)}
					{values.data && values.data.cotizationSent === "false" && (
						<TextField 
							className={classes.wideField} 
							name="data.emailBody" 
							label="Email body to send" 
							multiline 
							variant="outlined"
						/>
					)}
				</React.Fragment>
			);
		}
	}
};

const makeTaskForm = (taskName, props) => {
	// console.log(props);
	const taskFragment = taskFragments[taskName];
	const Fragment = taskFragment.Fragment;
	// if (taskFragment.initialValues) {
	// 	if (!props.initialValues) props.initialValues = {};
	// 	props.initialValues = {...taskFragment.initialValues, ...props.initialValues};
	// }
	return makeForm({ 
		validationSchema: Yup.object().shape({
			...schema,
			data: taskFragment.schema,
		}),
		...props,
	}, ({classes, values, isValid}: any) => {
		//@ts-ignore
		const completed = utils.taskIsCompleted(values);
		console.log("form values", values);
		return (
			<Form>
				<Title classes={classes}>{values.label}</Title>
				<Select 
					className={classes.wideField}
					name="assignee" 
					label="Assignee"
					labelWidth={40} 
					variant="outlined" 
					required={true} 
					options={props.users.map(user => [user.id, user.name])}
				/>
				<TextField
					required
					name="label"
					label="Label"
					className={classes.wideField}
					margin="normal"
					variant="outlined"
				/>
				<DateTimePicker name="due" label="Due" classes={classes} variant="outlined" />

				<Fragment {...props} values={values} />
				
				<Button 
					type="submit"
					disabled={!isValid} 
					className={classes.button} 
					variant="contained" 
					color={completed ? 'secondary' : 'primary'}
				>
					{completed ? 'Complete' : 'Save'}
				</Button>
			</Form>
		);
	})
};

const TaskForms = {};

export default ({task, ...props}: {task: Task}) => {
	if (!TaskForms[task.name]) TaskForms[task.name] = makeTaskForm(task.name, props);
	const TaskForm = TaskForms[task.name];
	return (
		<TaskForm initialValues={task} {...props} />
	)
};