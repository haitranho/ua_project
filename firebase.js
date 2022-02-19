import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Project API configurations - do not touch!
const firebaseConfig = {
    apiKey: "AIzaSyA7iwtXCRcyWID9qWec8W12tpZ23OGlgso",
    authDomain: "modio-45f92.firebaseapp.com",
    projectId: "modio-45f92",
    storageBucket: "modio-45f92.appspot.com",
    messagingSenderId: "955895092133",
    appId: "1:955895092133:web:3151813ec451aa03028e4c",
    measurementId: "G-VJE8RZMEDC"
};

// Initialize Firebase applications 
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}
const auth = firebase.auth();
const db = firebase.firestore(app);
const store = firebase.storage();
export {auth, db, store};