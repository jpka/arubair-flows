export interface Order {
	client: {
		name: String,
		email: String,
		phone?: String
	},
	type: 'import | export | other'
}

export const actionTypes = {
	addOrder: "ORDERS.ADD"
}

export const actions = {
	addOrder: (order: Order) => ({
		type: actionTypes.addOrder,
		payload: { order }
	})
}

export const reducer = (orders: Order[] = [], action) => {
	switch (action.type) {
		case actionTypes.addOrder:
			return [
				...orders,
				action.payload.order
			];
		default:
			return orders
	}
}

export default reducer;
