import firebase from 'firebase/app';
import 'firebase/auth';

import {
	actions as uiActions
} from './ui';
const auth = firebase.auth();

export interface User {
	name: String,
	email: String
}

const prefix = "USERS";
export const actionTypes = {
	add: `${prefix}.ADD`,
	creating: `${prefix}.CREATING`,
	created: `${prefix}.CREATED`,
	createError: `${prefix}.CREATE_ERROR`,
	authenticating: `${prefix}.AUTHENTICATING`,
	authenticated: `${prefix}.AUTHENTICATED`
}

export const actions = {
	addUser: () => ({type: actionTypes.add}),
	createUser: (email, password = "arubair") => async dispatch => {
		dispatch({ type: actionTypes.creating });
		try {
			await auth.createUserWithEmailAndPassword(email, password);
			return dispatch({ type: actionTypes.created });
		} catch (error) {
			// var errorCode = error.code;
			// var errorMessage = error.message;
			console.error("create user error", error);
			dispatch({ type: actionTypes.createError });
			return dispatch(uiActions.notification({
				type: "error",
				message: "User could not be created. Check your connection and try again"
			}));
		}
	},
	login: ({email, password}) => async dispatch => {
		dispatch({ type: actionTypes.authenticating });
		return dispatch({ type: actionTypes.authenticated });
	}
}

export interface UsersState {
	users: User[],
	current: User | null,
	creationStatus: "processing" | null
}

export const initialState: UsersState = {
	users: [],
	current: null,
	creationStatus: null
};

export const reducer = (state: UsersState = initialState, action) => {
	let { payload } = action;
	let { users } = state;

	switch (action.type) {
		case actionTypes.add:
			return {
				...state,
				users: [
					...users,
					{
						name: "",
						email: ""
					}
				]
			};
		case actionTypes.creating:
			return {
				...state,
				creationStatus: "processing"
			};
		case actionTypes.created:
			return {
				...state,
				creationStatus: "success"
			};
		case actionTypes.createError:
			return {
				...state,
				creationStatus: "error"
			};
		case actionTypes.authenticated:
			return {
				...state,
				current: payload.user
			};
		default:
			return state
	}
}

export default reducer;
