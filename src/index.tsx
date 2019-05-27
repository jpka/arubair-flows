import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import { connect } from 'react-redux';
import 'typeface-roboto';

import BaseUsers from './components/Users';
import BaseTimetable from './components/Timetable';
import BaseDashboard from './components/Dashboard';
import { 
	actions as uiActions,
	reducer as uiReducer
} from './modules/ui';
import { 
	actions as usersActions,
	reducer as usersReducer
} from './modules/users';
import { 
	actions as ordersActions,
	reducer as ordersReducer
} from './modules/orders';

export const Users = connect(
	state => ({ users: state.users }),
	dispatch => bindActionCreators(usersActions, dispatch)
)(BaseUsers);

export const Timetable = connect(
	state => ({ orders: state.orders }),
	dispatch => bindActionCreators({ newOrder: uiActions.newOrder }, dispatch)
)(BaseTimetable);

export const Dashboard = connect(
	state => ({ ui: state.ui }),
	// dispatch => bindActionCreators({  }, dispatch)
)(BaseDashboard);

const reducer = combineReducers({
	ui: uiReducer,
	users: usersReducer,
	orders: ordersReducer
});

interface State {
	ui: any,
	users: any,
	orders: any
}

const initialState: State = {
	ui: {
		drawer: "newOrder"
	},
	users: [
		{
			name: "Mónica Romanowski",
			email: "fake@email.com"
		}
	],
	orders: []
};

const store = createStore(reducer, initialState);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
