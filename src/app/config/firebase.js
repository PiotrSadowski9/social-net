import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "revents7.firebaseapp.com",
    projectId: "revents7",
    storageBucket: "revents7.appspot.com",
    messagingSenderId: "365111837222",
    appId: "1:365111837222:web:ec5a20a0a7112c63f3dce7",
    databaseURL: "https://revents7-default-rtdb.europe-west1.firebasedatabase.app" //problemy z firebase real time
}

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;