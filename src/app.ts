// import { bindActionCreators, combineReducers } from 'redux';
// import { connect } from 'react-redux';

// import BaseUsers from './components/Users';
// import BaseTimetable from './components/Timetable';
// import { 
// 	actions as usersActions,
// 	reducer as usersReducer
// } from './modules/users';
// import { 
// 	actions as ordersActions,
// 	reducer as ordersReducer
// } from './modules/orders';

// const actionTypes = {
// 	newOrder: "NEW_ORDER"
// };

// const actions = {
// 	newOrder: () => ({ type: actionTypes.newOrder })
// };

// const reducer = (state = {}, action) => {
// 	switch (action.type) {
// 		case actionTypes.newOrder:
// 			return {
// 				...state,
// 				drawer: "newOrder"
// 			}
// 		default:
// 			return state
// 	}
// }

// export const Users = connect(
// 	state => ({ users: state.users }),
// 	dispatch => bindActionCreators(usersActions, dispatch)
// )(BaseUsers);

// export const Timetable = connect(
// 	state => ({ app: state.app, orders: state.orders }),
// 	dispatch => bindActionCreators({ newOrder: actions.newOrder }, dispatch)
// )(BaseTimetable);

// export const rootReducer = combineReducers({
// 	app: reducer,
// 	users: usersReducer,
// 	orders: ordersReducer
// });

// export const initialState = {
// 	app: {
// 		drawer: null
// 	},
// 	users: [
// 		{
// 			name: "Mónica Romanowski",
// 			email: "fake@email.com"
// 		}
// 	],
// 	orders: []
// };