import React, { FC } from 'react';
import { Paper } from '@material-ui/core';
import { actions as usersActions } from '../modules/users';
import { connect } from 'react-redux';
import LoginForm from './forms/Login';

const Login = connect(
	null,
	dispatch => ({ onSubmit: usersActions.login })
)(LoginForm);

export default Login;