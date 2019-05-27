export interface User {
	name: String,
	email: String
}

export const actionTypes = {
	addUser: "USERS.ADD"
}

export const actions = {
	addUser: () => ({type: actionTypes.addUser})
}

export const reducer = (users: User[] = [], action) => {
	switch (action.type) {
		case actionTypes.addUser:
			return [
				...users,
				{
					name: "",
					email: ""
				}
			];
		default:
			return users
	}
}

export default reducer;
