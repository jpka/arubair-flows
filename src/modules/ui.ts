import { combineReducers } from "redux";
// import { reducer as formsReducer } from "redux-form";

export const actionTypes = {
	newOrder: "NEW_ORDER"
};

export const actions = {
	newOrder: () => ({ type: actionTypes.newOrder })
};

export const reducer = combineReducers({
	// forms: formsReducer,
	drawer: (state = null, action) => {
		switch (action.type) {
			case actionTypes.newOrder:
				return "newOrder";
			default:
				return state;
		}
	}
});