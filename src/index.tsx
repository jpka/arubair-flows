import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import { connect } from 'react-redux';
import thunk from 'redux-thunk';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import PickerAdapter from '@date-io/moment';
import { SnackbarProvider } from 'notistack';
import 'typeface-roboto';

import './index.css';
import * as serviceWorker from './serviceWorker';
import './plumbing';
import App from './components/App';
import BaseUsers from './components/Users';
import BaseDashboard from './components/Dashboard';
import BaseDrawer from './components/Drawer';
import { 
	actions as uiActions,
	reducer as uiReducer,
} from './modules/ui';
import { 
	actions as usersActions,
	reducer as usersReducer,
	connect as usersConnect
} from './modules/users';
import { 
	actions as ordersActions,
	reducer as ordersReducer,
	connect as ordersConnect,
	initialState as ordersInitialState,
	OrdersState
} from './modules/orders';

export const Users = connect(
	({users}: State) => ({ users }),
	{addUser: uiActions.newUser}
)(BaseUsers);

// export const Drawer = connect(
// 	null,
// 	dispatch => bindActionCreators({ newOrder: ordersActions.new }, dispatch)
// )(BaseDrawer);

export const Dashboard = connect(
	({ui}: State) => ({ ui }),
	// dispatch => bindActionCreators({  }, dispatch)
)(BaseDashboard);

const reducer = combineReducers({
	ui: uiReducer,
	users: usersReducer,
	orders: ordersReducer
});

export interface State {
	ui?: any,
	users?: any,
	orders: OrdersState
}

const initialState: State = {
	// users: [
	// 	{
	// 		name: "Mónica Romanowski",
	// 		email: "fake@email.com"
	// 	}
	// ],
	// ui: {
	// 	drawer: {
	// 		"view": "editTask",
	// 		"params": {
	// 			"orderId": "y2RxWLk2CNhuHVHUA8Xj",
	// 			"taskId": "aAGv0YCNXc9XYAEhwcWH"
	// 		}
	// 	}
	// },
	orders: ordersInitialState,
	ui: {
		modal: false
	}
};

const composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));
ordersConnect(store.dispatch);
usersConnect(store.dispatch);

ReactDOM.render(
	<Provider store={store}>
		<MuiPickersUtilsProvider utils={PickerAdapter}>
			<SnackbarProvider maxSnack={3}>
				<App />
			</SnackbarProvider>
		</MuiPickersUtilsProvider>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
