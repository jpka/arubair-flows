import { combineReducers } from "redux";
// import { reducer as formsReducer } from "redux-form";

const prefix = `UI`;
export const actionTypes = {
	newOrder: `${prefix}.NEW_ORDER`,
	editOrder: `${prefix}.EDIT_ORDER`,
	editTask: `${prefix}.EDIT_TASK`,
	newUser: `${prefix}.NEW_USER`,
	editUser: `${prefix}.EDIT_USER`,
	notification: `${prefix}.NOTIFICATION`,
	openDrawer: `${prefix}.OPEN_DRAWER`,
	closeDrawer: `${prefix}.CLOSE_DRAWER`,
	closeModal: `${prefix}.CLOSE_MODAL`,
	setModalOpen: `${prefix}.SET_MODAL_OPEN`
};

export const actions = {
	newOrder: () => ({ type: actionTypes.newOrder }),
	editOrder: (orderId) => ({ type: actionTypes.editOrder, payload: { orderId } }),
	editTask: (orderId, taskId) => ({ type: actionTypes.editTask, payload: { orderId, taskId } }),
	newUser: () => ({ type: actionTypes.newUser }),
	editUser: (userId) => ({ type: actionTypes.editUser, payload: { userId } }),
	notification: (notification) => ({ type: actionTypes.notification, payload: notification }),
	openDrawer: (view, params) => ({ type: actionTypes.openDrawer, payload: { view, params } }),
	closeDrawer: () => ({ type: actionTypes.closeDrawer }),
	closeModal: () => ({ type: actionTypes.closeModal }),
	setModalOpen: (state) => ({ type: actionTypes.setModalOpen, payload: state })
};

interface DrawerState {
	view: String,
	params: any
}

export const reducer = combineReducers({
	// forms: formsReducer,
	notification: (notification = null, action) => action.type === actionTypes.notification ? action.payload : notification,
	modal: (state = false, action) => typeof action.payload === "boolean" ? action.payload : state,
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
			case actionTypes.editUser:
				return {view: "editUser", params: null};
			case actionTypes.openDrawer:
				return {view: payload.view, params: payload.params};
			case actionTypes.closeDrawer:
				return null;
			default:
				return state;
		}
	}
});