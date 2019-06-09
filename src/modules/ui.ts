import { combineReducers } from "redux";
// import { reducer as formsReducer } from "redux-form";

const prefix = `UI`;
export const actionTypes = {
	newOrder: `${prefix}.NEW_ORDER`,
	editOrder: `${prefix}.EDIT_ORDER`,
	editTask: `${prefix}.EDIT_TASK`,
	newUser: `${prefix}.NEW_USER`,
	notification: `${prefix}.ERROR`
};

export const actions = {
	newOrder: () => ({ type: actionTypes.newOrder }),
	editOrder: (orderId) => ({ type: actionTypes.editOrder, payload: { orderId } }),
	editTask: (orderId, taskId) => ({ type: actionTypes.editTask, payload: { orderId, taskId } }),
	newUser: () => ({ type: actionTypes.newUser }),
	notification: (notification) => ({ type: actionTypes.notification, payload: notification })
};

interface DrawerState {
	view: String,
	params: any
}

export const reducer = combineReducers({
	// forms: formsReducer,
	notification: (notification = null, action) => action.type === actionTypes.notification ? action.payload : notification,
	drawer: (state: DrawerState | null = null, action) => {
		const payload = action.payload;
		switch (action.type) {
			case actionTypes.newOrder:
				return {view: "newOrder", params: null};
			case actionTypes.editOrder:
				return {view: "editOrder", params: payload};
			case actionTypes.editTask:
				return {view: "editTask", params: payload};
			case actionTypes.newUser:
				return {view: "newUser", params: null};
			default:
				return state;
		}
	}
});