import React from 'react';
import Modal from '../components/Modal';
import EmailForm from '../components/forms/Task';
import { connect } from 'react-redux';
import { State } from '../index';

const viewsMap = {
	EmailForm: connect(
		({orders}: State, {taskId}: any) => orders.tasks[taskId].emails,
		({})
	)(EmailForm)
};

export default () => {
}