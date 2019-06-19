import React, { useState } from "react";
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
import Modal from "../Modal";
import {
	Task,
	utils,
	actions as ordersActions
} from "../../modules/orders";

const SendEmailButton = (props) => {
	return <OGSendEmailButton 
		className={props.className}
		send={props.sendEmails}
		status={props.values.emails && props.values.emails.status}
		// sentTimes={props.values.emails && props.values.emails.sentTimes}
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
		Fragment: ({classes, modalOpen, setModalOpen, ...props}) => {
			const { values } = props;
			// if (!values.prices) values.prices = {
			// 	freights: [],
			// 	agents: []
			// }
			if (values.data && values.data.cotizationSent) values.data.cotizationSent = values.data.cotizationSent.toString();
			return (
				<React.Fragment>
					<Modal open={modalOpen} setOpen={setModalOpen}>
						<EmailForm classes={classes} {...props} index={0} />
					</Modal>
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
						<Button
							className={classes.button} 
							variant="contained" 
							color="secondary"
							onClick={() => setModalOpen(true)}
						>
							Send email to client
						</Button>
					)}
				</React.Fragment>
			);
		}
	},
	cotizationFollowup: {
		schema: {},
		Fragment: ({classes, setValues, modalOpen, setModalOpen, ...props}) => {
			const { values } = props;
			// const [emailModalOpen, setEmailModalOpen] = useState(false);
			
			if (values.data && values.data.jobDate && (values.data.jobDateReserved === "false" || values.data.cotizationAnswered === "false")) {
				setValues({...values, data: {...values.data, jobDate: null}});
			}

			console.log("values", values);

			return (
				<React.Fragment>
					<FormGroup row>
						<SubTitle classes={classes}>Cotization answered?</SubTitle>
						<RadioGroup name="data.cotizationAnswered" options={[["Yes", true], ["No", false]]} />
					</FormGroup>
					{values.data && values.data.cotizationAnswered === "true" && (
						<React.Fragment>
							<FormGroup row>
								<SubTitle classes={classes}>job date reserved?</SubTitle>
								<RadioGroup name="data.jobDateReserved" options={[["Yes", true], ["No", false]]} />
							</FormGroup>
							{values.data && values.data.jobDateReserved === "true" && (
								<DateTimePicker 
									name="data.jobDate" 
									label="Job date" 
									classes={classes} 
									variant="outlined" 
								/>
							)}
						</React.Fragment>
					)}
					{values.data && (values.data.cotizationAnswered === "false" || values.data.jobDateReserved === "false") && (
						<React.Fragment>
							<Modal open={modalOpen} setOpen={setModalOpen}>
								<EmailForm classes={classes} {...props} index={0} />
							</Modal>
							<Button 
								className={classes.button} 
								variant="contained" 
								color="secondary"
								onClick={() => setModalOpen(true)}
							>
								Send email to client
							</Button>
							{/* <TextField name="emails.list[0].subject" label="Email subject" variant="outlined" />
							<TextField name="emails.list[0].body" label="Email body" variant="outlined" multiline />
							<SendEmailButton className={classes.button} values={values} {...props} /> */}
						</React.Fragment>
					)}
				</React.Fragment>
			);
		}
	}
};

export const EmailForm = React.forwardRef(({index, classes, ...props}: any, ref) => {
	return (
		<React.Fragment>
			<TextField name={`emails.list[${index}].subject`} label="Subject" variant="outlined" />
			<TextField name={`emails.list[${index}].body`} label="Body" variant="outlined" multiline />
			<SendEmailButton className={classes.button} {...props} />
		</React.Fragment>
	)
});

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
	}, ({classes, values, isValid, ...otherProps}: any) => {
		//@ts-ignore
		const completed = utils.taskIsCompleted(values);
		// console.log("form values", values);
		const userOptions: any[] = Object.values(props.users).map((user: any) => [user.id, user.name]);
		// const overdueStyle = {
		// 	border: "2px solid red"
		// };
		// const overdue = values.status === 'overdue';
		return (
			<Form>
			{/* // <Form style={overdue ? overdueStyle : {}}> */}
				<Title classes={classes}>{values.label}</Title>
				<TextField
					required
					name="label"
					label="Label"
					className={classes.wideField}
					margin="normal"
					variant="outlined"
				/>
				<Select 
					className={classes.wideField}
					name="assignee" 
					label="Assignee"
					labelWidth={70} 
					variant="outlined" 
					required={false} 
					options={userOptions}
				/>
				<Select 
					className={classes.wideField}
					name="subscribers" 
					label="Subscribers"
					labelWidth={80} 
					variant="outlined" 
					required={false} 
					options={userOptions.filter(([id]) => id !== values.assignee)}
					multiple
				/>
				<DateTimePicker name="due" label="Due" classes={classes} variant="outlined" />

				<Fragment {...props} {...otherProps} values={values} />
				
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

export default (props: {task: Task}) => {
	const { task } = props;
	if (!TaskForms[task.name]) TaskForms[task.name] = makeTaskForm(task.name, props);
	const TaskForm = TaskForms[task.name];
	return (
		<TaskForm initialValues={task} {...props} />
	)
};