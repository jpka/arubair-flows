import moment from 'moment';
import firebase, { database } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/auth';
import produce from 'immer';
// import { uniq, different } from 'lodash';

import { actions as uiActions } from './ui';

const db = firebase.firestore();
const Timestamp = firebase.firestore.Timestamp;
const ordersColl = db.collection('orders');

export const statuses: {
	inProgress: 'in progress',
	pending: 'pending',
	completed: 'completed'
} = {
	inProgress: "in progress",
	pending: "pending",
	completed: "completed"
}

export interface Order {
	id?: string,
	status: 'in progress' | 'completed' | 'canceled',
	createdAt: firebase.firestore.Timestamp | Date,
	client: {
		name: string,
		email: string,
		phone?: string
	},
	type: 'import' | 'export' | 'other',
	tasks?: {
		[date: string]: Task[]
	}
}

export interface TaskEmail {
	body: string,
	subject?: string,
	recipients: {
		address: string,
		[key: string]: any
	}[], 
	status: 'pending' | 'sending' | 'sent' | 'failed',
	error?: string
};
export interface Task {
	id?: string,
	orderId?: string,
	name: 'importCotizationConfirmation' | 'exportCotizationConfirmation' | 'exportPricesRequest' | 'cotizationFollowup',
	label: string,
	type: 'alarm' | 'email',
	status: 'pending' | 'in progress' | 'completed' | 'overdue',
	due: firebase.firestore.Timestamp | Date,
	dueDate?: number,
	data?: any,
	emails?: {
		status: 'pending' | 'sending' | 'sent' | 'failed',
		list: TaskEmail[]
	}
}

const prefix = "ORDERS";
export const actionTypes = {
	orders: {
		add: `${prefix}.ADD_ORDER`,
		modify: `${prefix}.MODIFY_ORDER`,
		remove: `${prefix}.REMOVE_ORDER`,
		added: `${prefix}.ORDER_ADDED`,
		modified: `${prefix}.ORDER_MODIFIED`,
		removed: `${prefix}.ORDER_REMOVED`
	},
	tasks: {
		add: `${prefix}.ADD_TASK`,
		modify: `${prefix}.MODIFY_TASK`,
		remove: `${prefix}.REMOVE_TASK`,
		added: `${prefix}.TASK_ADDED`,
		modified: `${prefix}.TASK_MODIFIED`,
		removed: `${prefix}.TASK_REMOVED`,
		emails: {
			sending: `${prefix}.TASK_EMAILS.SENDING`,
			sent: `${prefix}.TASK_EMAILS.SENT`,
			sendingFailed: `${prefix}.TASK_EMAILS.SENDING_FAILED`
		}
	},
	tasksChanged: `${prefix}.TASKS_CHANGED`,
	orderTasksChanged: `${prefix}.ORDER_TASKS_CHANGED`,
}

const isEmpty = v => v === null || v === undefined || v === "";
const checkEmails = (emails) => emails && emails.status === "sent"
const tasksMeta: {
	[key: string]: {
		defaults?: any,
		conditions?: {
			data?: (Task) => boolean
		},
		beforeSave?: (task: Task) => any,
		afterSave?: (task: Task) => any,
		afterSendEmails?: (task: Task) => any
	}
} = {
	importCotizationConfirmation: {
		defaults: {
			label: "Cotization confirmation",
		},
		conditions: {
			data: ({data}) => data && !isEmpty(data.cotization)
		}
	},
	exportCotizationConfirmation: {
		defaults: {
			label: "Cotization confirmation",
		},
		conditions: {
			data: ({data, emails}) => (
				(data && !isEmpty(data.cotization))
				||
				checkEmails(emails)
			)
		},
		afterSave: (task: Task) => {
			if (!task.orderId) return;
			if (task.status === "completed") {
				createTask(task.orderId, {
					type: "alarm",
					name: "cotizationFollowup",
					due: moment().add(7, 'days').toDate()
				});
			}
		}
	},
	exportPricesRequest: {
		defaults: {
			label: "Prices request",
			emails: {
				list: [
					{ 
						body: "Freight price request template",
						subject: "Price request",
						recipients: []
					},
					{ 
						body: "Destination agent price request template",
						subject: "Price request",
						recipients: []
					}
				]
			}
		},
		conditions: {
			data: ({emails}) => {
				return (
					emails.list.every(email => email.recipients.every(recipient => recipient.answered))
					&&
					checkEmails(emails)
				);
			}
		},
		// beforeSave: (task) => {
		// 	let {data} = task;
		// 	if (data && data.prices) {
		// 		if (!task.emails) task.emails = [];
		// 		Object.keys(data.prices).forEach(key => {
		// 			data.prices[key].forEach(({email}) => {
		// 				if (!task.emails) return;
		// 				if (!task.emails.find(item => item.recipient === email)) {
		// 					task.emails.push({
		// 						recipient: email,
		// 						body: data.emailBody,
		// 						status: "pending"
		// 					});
		// 				}
		// 			});
		// 		});
		// 	}
		// 	return task;
		// }
	},
	cotizationFollowup: {
		defaults: {
			label: "Cotization followup",
			emails: {
				list: [
					{
						subject: "Cotization followup", 
						body: "Cotization followup template for 1 week after",
						recipients: { address: "CLIENT_ADDRESS" },
					},
					{
						subject: "Cotization followup", 
						body: "Cotization followup template for 3 week after",
						recipients: { address: "CLIENT_ADDRESS" },
					}
				]
			}
		},
		conditions: {
			data: ({data}) => data && data.jobDate
		},
		beforeSave: (task: Task) => {
			const { data, emails, status } = task;
			if (data && status !== "completed" && data.cotizationAnswered === "true" && data.jobDateReserved === "false") {
				task.due = moment(task.due).add(14, 'days').toDate();
				task.status = "pending";
			}
			return task;
		},
		afterSendEmails: ({orderId, id, due, emails}: Task) => {
			// TODO: have this happen only when email sents are succesful
			// if (checkEmails(emails)) {
				if (due instanceof Timestamp) due = due.toDate();
				ordersColl.doc(orderId).collection('tasks').doc(id).update({
					due: moment(due).add(7, 'days').toDate()
				});
			// }
		}
	}
}

const formatTask = (task: Partial<Task>) => {
	// if (task.due instanceof Date) task.due = Timestamp.fromDate(task.due);
	task.data && Object.keys(task.data).forEach(key => { 
		const value = task.data[key];
		if (
			(typeof value === "string" && value.trim() === "")
		)  {
			task.data[key] = null
		}
	});
	return task;
}

// const parseTask = (task: Task) => {
// 	task.data && Object.keys(task.data).forEach(key => { 
// 		const value = task.data[key];
// 		if (
// 			(typeof value === "string" && value.trim() === "")
// 		)  {
// 			task.data[key] = null
// 		}
// 	});
// 	return task;
// }

const createTask = async (orderId: string, {name, ...task}: Partial<Task>) => {
	const defaults = (name && tasksMeta[name] && tasksMeta[name].defaults) || {};
	const currentUser = firebase.auth().currentUser;
	return ordersColl.doc(orderId).collection('tasks').add(formatTask({
		status: "pending",
		name,
		orderId,
		assignee: currentUser && currentUser.uid,
		...defaults,
		...task
	}));
}

const getTask = (orderId: string, id: string) => ordersColl.doc(orderId).collection('tasks').doc(id).get({source: "cache"});

const taskIsCompleted = (task: Task) => {
	const conditions = tasksMeta[task.name] && tasksMeta[task.name].conditions;
	if (!conditions) return true;
	return Object.keys(conditions).every(conditionKey => {
		const condition = conditions[conditionKey];
		switch (conditionKey) {
			case "data":
				return condition(task);
				// return condition.every(([name, value]) => {
				// 	const taskValue = task[name];
				// 	if (value === undefined) {
				// 		return task.hasOwnProperty(name) && taskValue !== null && taskValue !== undefined
				// 	} else {
				// 		return taskValue === value;
				// 	}
				// });
		}
		return false;
	});
}

export const actions = {
	order: {
		add: (order: Order) => {
			return async (dispatch) => {
				const doc = await ordersColl.add({status: "in progress", createdAt: Timestamp.now(), ...order});
				switch (order.type) {
					case "import":
						await createTask(doc.id, {
							type: "alarm",
							name: "importCotizationConfirmation",
							due: moment().add(24, 'hours').toDate(),
						});
						break;
					case "export":
						await Promise.all([
							createTask(doc.id, {
								type: "alarm",
								name: "exportPricesRequest",
								due: new Date(),
								status: "overdue"
							}),
							createTask(doc.id, {
								type: "alarm",
								name: "exportCotizationConfirmation",
								due: moment().add(48, 'hours').toDate()
							})
						]);
						break;
				}
				// collection.add(otherOrder);
				return { type: actionTypes.orders.add };
			}
		},
		remove: (orderId) => async dispatch => {
			// TODO : delete tasks (https://firebase.google.com/docs/firestore/manage-data/delete-data#collections)
			await ordersColl.doc(orderId).delete();
			return { type: actionTypes.orders.remove };
		},
		modify: (orderId, data) => async dispatch => {
			try {
				await ordersColl.doc(orderId).update(data);
				dispatch(uiActions.closeDrawer());
				return dispatch(uiActions.notification({
					type: "success",
					message: "Order updated"
				}));
			} catch (e) {
				return dispatch(uiActions.notification({
					type: "error",
					message: "Order could not be updated. Check your connection and try again"
				}));
			}
		},
		added: (id: string, order: Order) => ({
			type: actionTypes.orders.added,
			payload: { id, order }
		}),
		modified: (id: string, order: Order) => ({
			type: actionTypes.orders.modified,
			payload: { id, order }
		}),
		removed: (id: string) => ({
			type: actionTypes.orders.removed,
			payload: { id }
		})
	},
	task: {
		remove: (orderId, id) => async (dispatch) => {
			await ordersColl.doc(orderId).collection('tasks').doc(id).delete();
			return dispatch({ type: actionTypes.tasks.remove });
		},
		modify: (orderId, id, values: Partial<Task>) => async (dispatch) => {
			values = formatTask(values);
			const doc = ordersColl.doc(orderId).collection('tasks').doc(id);
			const savedTask: any = (await doc.get({source: "cache"})).data() || {};
			const taskMeta = tasksMeta[savedTask.name];
			const updatedTask = {...savedTask, ...values};
			if (taskIsCompleted(updatedTask)) {
				values.status = updatedTask.status = statuses.completed;
			} else if (values.status === statuses.completed) {
				values.status = updatedTask.status = statuses.pending;
			}
			console.log("update values", values);
			try {
				if (taskMeta.beforeSave) taskMeta.beforeSave(updatedTask);
				await doc.update(updatedTask);
				if (taskMeta.afterSave) taskMeta.afterSave(updatedTask);
				dispatch(uiActions.closeDrawer());
				dispatch(uiActions.notification({
					type: "success",
					message: "Task updated"
				}));
				return dispatch({ type: actionTypes.tasks.modify });
			} catch (e) {
				console.error(e);
				return dispatch(uiActions.notification({
					type: "error",
					message: "Task could not be updated. Check your connection and try again"
				}));
			}
		},
		added: (orderId, id, task: Task) => ({
			type: actionTypes.tasks.added,
			payload: { orderId, id, task }
		}),
		modified: (orderId, id, task: Task) => ({
			type: actionTypes.tasks.modified,
			payload: { orderId, id, task }
		}),
		removed: (orderId: string, id: string) => ({
			type: actionTypes.tasks.removed,
			payload: { orderId, id }
		}),
		sendEmails: (orderId: string, id: string) => async dispatch => {
			// const task = (await getTask(orderId, id)).data();
			// if (!task) return;
			// const emails = tasksMeta[task.name].getEmails();
			dispatch({ type: actionTypes.tasks.emails.sending, payload: { orderId, id} });
			try {
				await firebase.functions().httpsCallable('sendTaskEmailsNow')({orderId, taskId: id, mock: true});
			} catch (e) {
				console.error("sendEmails error", e);
				dispatch(uiActions.notification({type: "error", message: "There was an issue sending the emails, check your connection and try again"}));
				return dispatch({ type: actionTypes.tasks.emails.sendingFailed, payload: {orderId, id} });
			}

			const task: any = (await getTask(orderId, id)).data();
			if (task) {
				const hook = tasksMeta[task.name] && tasksMeta[task.name].afterSendEmails;
				hook && hook(task);
			}

			dispatch(uiActions.setModalOpen(false));
			dispatch(uiActions.notification({type: "success", message: "Email(s) sent"}));
			return dispatch({ type: actionTypes.tasks.emails.sent, payload: {orderId, id} });
		}
	},
	tasksChanged: (tasks) => ({
		type: actionTypes.tasksChanged,
		payload: { tasks }
	}),
	orderTasksChanged: (orderId, tasks) => ({
		type: actionTypes.orderTasksChanged,
		payload: { orderId, tasks }
	})
}

const getDueDate = (task) => {
	if (task.due.toDate) task.due = task.due.toDate();
	return moment(task.due).dayOfYear();
}

const insertDate = (dates, date) => {
	let i = 0;
	while (dates[i] < date) {
		i++;
	}
	if (dates[i] !== date) dates.splice(i, 0, date);
	return dates;
}

export interface OrdersState {
	orders: {[id: string]: Order},
	tasks: {[id: string]: Task},
	orderedTasks: {[date: string]: {[orderId: string]: Task[]}},
	dates: number[]
}

export const initialState = {
	orders: {},
	tasks: {},
	orderedTasks: {},
	dates: []
}

const assignTask = ({tasks}: OrdersState, {id, orderId, dueDate, task}) => {
	// const defaults = tasksMeta[task.name] && tasksMeta[task.name].defaults) || {};
	const defaults = {};
	tasks[id] = { id, orderId, dueDate, ...defaults, ...task };
}

const addTask = (state: OrdersState, payload) => {
	let {id, orderId, task}: {id: string, orderId: string, task: Task} = payload;
	let { orderedTasks, dates, tasks } = state;
	const dueDate = task.dueDate || getDueDate(task);
	assignTask(state, {dueDate, ...payload});
	if (!orderedTasks[dueDate]) orderedTasks[dueDate] = {};
	if (!orderedTasks[dueDate][orderId]) orderedTasks[dueDate][orderId] = [];
	const index = orderedTasks[dueDate][orderId].findIndex(item => item.id === id);
	if (index > -1) {
		orderedTasks[dueDate][orderId][index] = tasks[id];
	} else {
		orderedTasks[dueDate][orderId].push(tasks[id]);
	}
	insertDate(dates, dueDate);
}

const removeTask = (state: OrdersState, {id, orderId}) => {
	let { tasks, orderedTasks, dates } = state;
	const task = tasks[id];
	const dueDate = task.dueDate || getDueDate(task);

	if (orderedTasks[dueDate] && orderedTasks[dueDate][orderId]) {
		const index = orderedTasks[dueDate][orderId].findIndex(item => item.id === id);
		if (index > -1) orderedTasks[dueDate][orderId].splice(index, 1);
		if (orderedTasks[dueDate][orderId].length === 0) delete orderedTasks[dueDate][orderId];
		if (Object.keys(orderedTasks[dueDate]).length === 0) {
			delete orderedTasks[dueDate];
			dates.splice(dates.indexOf(dueDate), 1);
		}
	}

	delete tasks[id];
}

export const reducer = (state: OrdersState = initialState, action) => produce(state, (draft: OrdersState) => {
	const { payload } = action;
	if (payload && payload.task) {
		payload.task.due = payload.task.due.toDate();
		payload.task.dueDate = getDueDate(payload.task);
	}
	switch (action.type) {
		case actionTypes.orders.added:
		case actionTypes.orders.modified:
			draft.orders[action.payload.id] = {id: action.payload.id, ...action.payload.order};
			break;
		case actionTypes.orders.removed:
			delete draft.orders[action.payload.id];
			break;
		// 	// return ({
		// 	// 	...state,
		// 	// 	orders: {
		// 	// 		...state.orders,
		// 	// 		[action.payload.id]: action.payload.order
		// 	// 	}
		// 	// });
		// case actionTypes.orderTasksChanged:
		// 	let tasks = {};
		// 	payload.tasks.forEach(task => {
		// 		const data = task.data();
		// 		const dueDate = getDueDate(data);
		// 		if (!tasks[dueDate]) tasks[dueDate] = {};
		// 		tasks[dueDate].push(task.id);
		// 	});
		// 	draft.orderedTasks[payload.orderId] = tasks;
		// 	break;
		case actionTypes.tasks.added:
			addTask(draft, payload);
			break;
		case actionTypes.tasks.modified:
			if (draft.tasks[payload.id].dueDate !== payload.task.dueDate) removeTask(draft, payload);
			addTask(draft, payload);
			break;
		case actionTypes.tasks.removed:
			removeTask(draft, payload);
			break;
		// case actionTypes.tasksChanged:
		// 	uniq(payload.tasks.map(doc => getDueDate(doc.data()).toString()));
		// 	break;
			// return ({
			// 	...state,
			// 	dates: action.payload.tasks.map(doc => getDueDate(doc.data()))
			// })
		case actionTypes.tasks.emails.sending:
			payload.task = state.tasks[payload.id];
			payload.task.emails.status = "sending";
			addTask(draft, payload);
			break;
		case actionTypes.tasks.emails.sendingFailed:
			payload.task = state.tasks[payload.id];
			payload.task.emails.status = "failed";
			addTask(draft, payload);
			break;
		// case actionTypes.tasks.emails.sent:
		// 	payload.task = state.tasks[payload.id];
		// 	payload.task = {
		// 		...payload.task,
		// 		emails: {
		// 			...payload.task.emails,
		// 			status: "sent"
		// 		}
		// 	};
		// 	draft.tasks[payload.id] = payload.task;
			// draft.orderedTasks[payload.task.dueDate][payload.task.orderId].indexOf();
			// addTask(draft, payload);
			// break;
		// default:
		// 	return state
	}
});

const taskNotificationTitle = (order, task) => `${task.label} - ${order.client.name}`;

export const connect = (dispatch) => {
	let initialLoad = false;
	ordersColl.where("status", "==", statuses.inProgress).orderBy('createdAt').onSnapshot(snapshot => {
		// console.log('order change', snapshot);
		snapshot.docChanges().forEach(change => {
			const orderDoc = change.doc;
			const order = orderDoc.data();
			switch (change.type) {
				case "added":
					change.doc.ref.collection('tasks').orderBy('due').onSnapshot(snapshot => {
						snapshot.docChanges().forEach(change => {
							const task = change.doc.data();
							// if (initialLoad) dispatch(uiActions.notification({
							// 	type: "success", 
							// 	message: `Task '${task.label} (${order.client.name})' was ${change.type}`
							// }));
							// dispatch(uiActions.closeTask());
							if (change.type === "removed") {
								dispatch(actions.task.removed(orderDoc.id, change.doc.id));
							} else {
								//@ts-ignore
								dispatch(actions.task[change.type](orderDoc.id, change.doc.id, task));
							}
						});
						// return dispatch(actions.orderTasksChanged(orderDoc.id, snapshot.docs));
					});
					//@ts-ignore
					return dispatch(actions.order.added(orderDoc.id, order));
				case "modified":
					//@ts-ignore
					return dispatch(actions.order.modified(orderDoc.id, order));
				case "removed":
					return dispatch(actions.order.removed(orderDoc.id));
			}
		});

		initialLoad = true;
	});
	// db.collectionGroup('tasks').orderBy('due').onSnapshot(snapshot => {
	// 	dispatch(actions.tasksChanged(snapshot.docs));
	// });
}

export default reducer;

export const utils = {
	taskIsCompleted,
	formatTask
};
