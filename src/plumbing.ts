import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyBFShbAKxP-A7I90schh5O1fJv0AyJmSeA",
	authDomain: "arubair-flows.firebaseapp.com",
	databaseURL: "https://arubair-flows.firebaseio.com",
	projectId: "arubair-flows",
	storageBucket: "arubair-flows.appspot.com",
	messagingSenderId: "619775745147",
	appId: "1:619775745147:web:a1f85ee881521c54"
};

// export default () => {
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	firebase.firestore().enablePersistence()
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });
// }