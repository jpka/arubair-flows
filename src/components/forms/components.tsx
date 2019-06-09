import React from 'react';
import { 
	TextField as MTextField,
	FormControl,
	InputLabel,
	Select as MSelect,
	MenuItem,
	OutlinedInput,
	Typography,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	Checkbox as MCheckbox,
	Radio as MRadio,
	RadioGroup as MRadioGroup,
	ListItemText,
	IconButton,
	FormControlLabel,
	Button,
	CircularProgress
} from '@material-ui/core';
import { 
	Formik, 
	Field, 
	Form as FForm, 
	FormikValues,
	FieldProps
} from 'formik';
import { DateTimePicker as OGDateTimePicker } from '@material-ui/pickers';
import { 
	Add as AddIcon,
	Remove as RemoveIcon,
	Send as SendIcon
} from '@material-ui/icons';
import { useStyles } from '../App';

// interface FormProps {
// 	handleSubmit: () => void,
// 	props: 
// }

// export const Form: React.FC<FormikValues> = ({children, initialValues, onSubmit, ...props}) => {
// 	return (
// 		<Formik initialValues={initialValues} onSubmit={onSubmit} {...props}>
// 			{({handleSubmit, ...props}) => (
// 				<FForm>
// 					{children}
// 				</FForm>
// 			)}
// 		</Formik>
// 	);
// }

export const Form = FForm;

const sanitize = (value) => {
	if (value === "true") value = true;
	if (value === "false") value = false;
	return value;
}

const handleChange = (field, name, value?) => {
	if (value !== undefined) {
		return field.onChange({target: {name, value: value}});
	} else {
		return (value) => field.onChange({target: {name, value: value}});
	}
}

export const TextField = ({name, ...props}) => {
	return (
		<Field name={name} render={({field}) => <MTextField {...field} value={field.value !== null && field.value !== undefined ? field.value : ""} {...props} />}/>
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

export const DateTimePicker = ({name, label, variant, ...props}) => (
	<Field name={name} render={({field}: FieldProps) => (
		<OGDateTimePicker
			name={name}
			label={label}
			value={field.value}
			minutesStep={30}
			onChange={(val: any) => field.onChange({target: {name, value: val.toDate()}})}
			inputVariant={variant}
			{...props}
		/>
	)} />
);

export const Checkbox = ({name, ...props}) => {
	return (
		<Field name={name} render={({field}: FieldProps) => {
			const control = <MCheckbox {...props} onChange={({target}) => handleChange(field, name, target.checked)} checked={field.value} />;
			if (props.label) {
				return (
					<FormControlLabel
						control={control}
						label={props.label}
					/>
				);
			} else {
				return control;
			}
		}} />
	)
}

export const CheckList = ({classes, name, ChecklistItem, newItem, ...props}) => (
	<React.Fragment>
		{props.title && <SubTitle classes={classes}>{props.title}</SubTitle>}
		<Field name={name} render={({field}: FieldProps) => {
			// <List className={classes.root}>
			if (!field.value) field.value = [];
			return (
			<List>
				{field.value.map((item, i) => (
					<ListItem key={i} role={undefined} dense button onClick={() => {}} alignItems="flex-start">
						<ChecklistItem name={`${name}[${i}]`} />
						<ListItemSecondaryAction>
							<IconButton onClick={() => field.value.splice(i, 1) && handleChange(field, name, field.value)} edge="end" aria-label="Remove">
								<RemoveIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
				<ListItem>
					<IconButton style={{margin: "0 auto"}} onClick={() => 
						handleChange(field, name, field.value.concat(newItem(field)))
					}><AddIcon /></IconButton>
				</ListItem>
			</List>
		)}} />
	</React.Fragment>
)

const EmailCheckListItem = ({name, ...props}) => {
	return (
		<React.Fragment>
			<ListItemIcon>
				<Checkbox
					name={`${name}.answered`}
					edge="start"
					tabIndex={-1}
					disableRipple
				/>
			</ListItemIcon>
			{/* <ListItemText primary={`Line item ${value + 1}`} /> */}
			
			<div>
				<TextField name={`${name}.name`} label="Name" />
			</div>
			<div>
				<TextField name={`${name}.address`} label="Email" />
			</div>
		</React.Fragment>
	);
}

export const EmailCheckList = ({classes, name, ...props}) => {
	return <CheckList 
		classes={classes} 
		name={name} 
		ChecklistItem={EmailCheckListItem} 
		newItem={() => ({address: '', name: '', answered: false})}
		{...props}
	/>;
}

export const Radio = ({value, ...props}) => {
	// return (
	// 	<Field name={name} render={({field}: FieldProps) => {
			props.value = value;
	// 		props.onChange = onChange;
			if (props.label) {
				return (
					<FormControlLabel
						control={<MRadio />}
						{...props}
						label={props.label}
					/>
				);
			} else {
				return <MRadio {...props} />;
			}
	// 	}} />
	// )
}

export const RadioGroup = ({name, options, ...props}) => {
	return (
		<Field name={name} render={({field}: FieldProps) => {
			if (!field.value) field.value = "";
			
			return (
				<MRadioGroup value={field.value} name={name} onChange={({target}: any) => handleChange(field, name, target.value)}>
					{options.map(([label, value], i) =>
						<Radio 
							key={i} 
							label={label} 
							value={value.toString()}
						/>
					)}
				</MRadioGroup>
			)
		}} />
	)
}

export const SendEmailButton = ({status, send, sentTimes, ...props}) => {
	const classes = useStyles();
	const sending = status === "sending";
	return (
		<div>
			<div style={{position: "relative"}}>
				<Button 
					onClick={send}
					disabled={sending}
					color="secondary"
					variant="contained"
					{...props}
				>
					Send <SendIcon className={classes.rightIcon} />
				</Button>
				{sending && <CircularProgress size={24} className={classes.buttonProgress} />}
			</div>
			{status === "failed" && <Error>Failed to send emails. Check the connection and try again</Error>}
			{(sentTimes && status !== "failed") && <Typography variant="caption">Emails succesfully sent {sentTimes} times</Typography>}
		</div>
	);
}

export const Error = ({children}) => <Typography variant="caption" color="secondary">{children}</Typography>
export const Title = ({classes, children}) => <Typography className={classes.header} variant="h6">{children}</Typography>;
export const SubTitle = ({classes, children}) => <Typography variant="subtitle1">{children}</Typography>;

export const makeForm = (props, Component) => {
	return ({classes, onSubmit, ...otherProps}) => {
		return (
			<Formik onSubmit={onSubmit} initialValues={otherProps.initialValues} {...props}>
				{(props) => <Component classes={classes} {...props} {...otherProps} />}
			</Formik>
		);
	};
}

// export const strings = {
// 	required:
// }