import firebase, { firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/firestore';

import {
	actions as uiActions
} from './ui';

const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const db = firebase.firestore();
const usersColl = db.collection('users');
let currentUserId: string | null = null;

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
	authenticationError: `${prefix}.AUTHENTICATION_ERROR`,
	authenticated: `${prefix}.AUTHENTICATED`,
	usersChanged: `${prefix}.USERS_CHANGED`
}

export const actions = {
	addUser: () => ({type: actionTypes.add}),
	createUser: ({name, email, password}) => async dispatch => {
		if (!password) password = "arubair";
		dispatch({ type: actionTypes.creating });
		try {
			const userCredential = await auth.createUserWithEmailAndPassword(email, password);
			if (userCredential.user) {
				userCredential.user.updateProfile({displayName: name});
				const docRef = await usersColl.doc(userCredential.user.uid);
				docRef.set({name, email});
			}
			console.log("credential", userCredential);
			// if (user)
			// usersColl.doc(userCredential.user.uid).;
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
		console.log(email, password);
		dispatch({ type: actionTypes.authenticating });
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password);
			// dispatch({ type: actionTypes.authenticated, payload: { user } });
			// return dispatch(uiActions.notification({
			// 	type: "success",
			// 	message: "Logged in"
			// }));
		} catch (error) {
			console.error("login error", error);
			dispatch({ type: actionTypes.authenticationError });
			return dispatch(uiActions.notification({
				type: "error",
				message: "User could not login. Check your connection and try again"
			}));
		}
	},
	authenticated: (user) => ({type: actionTypes.authenticated, payload: { user } }),
	usersChanged: (users) => ({ type: actionTypes.usersChanged, payload: users })
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
		case actionTypes.usersChanged:
			return {
				...state,
				users: payload
			}
		default:
			return state
	}
}

export const connect = async (dispatch) => {
	// await Notification.requestPermission();
	const messaging = firebase.messaging();
	messaging.requestPermission();
	messaging.usePublicVapidKey("BDojh40yQW6VzFh2vhoPTgpm1_sX_eFPUcYp7URaFC918qI3QXrYbdt3u25Fk4jWm_cghA2qs_N371b46hr-mAc");
	
	const fcmLog = (...msgs) => fcmLog("[FCM]", ...msgs);

	const getPersistedToken = () => {
		const previousToken: any = localStorage.getItem("fcmToken");
		return previousToken ? JSON.parse(previousToken) : null;
	}

	const cleanPreviousToken = () => {
		const previousToken = getPersistedToken();
		if (previousToken) usersColl.doc(previousToken.userId).update({[`tokens.${previousToken.token}`]: firestore.FieldValue.delete()});
	}

	const setupFCMToken = async (userId: string) => {
		let token;
		try {
			token = await messaging.getToken();
		} catch (e) {
			fcmLog("token retrieval error", e);
		}

		const previousToken = getPersistedToken();
		if (previousToken && previousToken.token === token) return;
		cleanPreviousToken();
		if (token === null || token === "null") return;
		localStorage.setItem("fcmToken", JSON.stringify({userId: userId, token}));
		return usersColl.doc(userId).update({[`tokens.${token}`]: true});
	}

	// // Callback fired if Instance ID token is updated.
	messaging.onTokenRefresh(() => {
		if (currentUserId) setupFCMToken(currentUserId);
	});

	messaging.onMessage(function(payload) {
		console.log('Message received. ', payload);
	});

	// const setUpMessaging = (userId) => {	
	// 	const sendTokenToServer = (token: string) => {
	// 		sendTokenToServer()
	// 	}

	// 	// Get Instance ID token. Initially this makes a network call, once retrieved
	// 	// subsequent calls to getToken will return from cache.
	// 	messaging.getToken().then(function(currentToken) {
	// 		if (currentToken) {
	// 			sendTokenToServer(currentToken);
	// 			// updateUIForPushEnabled(currentToken);
	// 		} else {
	// 			// Show permission request.
	// 			fcmLog('No Instance ID token available. Request permission to generate one.');
	// 			// Show permission UI.
	// 			// updateUIForPushPermissionRequired();
	// 			setTokenSentToServer(false);
	// 		}
	// 	}).catch(function(err) {
	// 		fcmLog('An error occurred while retrieving token. ', err);
	// 		showToken('Error retrieving Instance ID token. ', err);
	// 		setTokenSentToServer(false);
	// 	});
	// }

	auth.onAuthStateChanged((user) => {
		if (user) {
			// User is signed in.
			dispatch(actions.authenticated(user));
			currentUserId = user.uid;
			setupFCMToken(user.uid);
			// setUpMessaging(userId);
		} else {
			console.log("LOGGED OUT");
			// TODO: teardown sent tokens
			cleanPreviousToken();
		}
	});

	usersColl.onSnapshot(snapshot => {
		dispatch(actions.usersChanged(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))));
	});
}

export default reducer;
