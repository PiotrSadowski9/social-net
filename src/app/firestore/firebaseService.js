import { toast } from 'react-toastify';
import firebase from '../config/firebase';
import { setUserProfileData } from './firestoreService';

export function firebaseObjectToArray(snapshot) {
    if (snapshot) {
        return Object.entries(snapshot).map(e => Object.assign({}, e[1], {id: e[0]})); //zamiana obiektu na tablice z obiektami
    }
}

export function signInWithEmail(creds) { // logowanie do firebase
    return firebase
    .auth()
    .signInWithEmailAndPassword(creds.email, creds.password)
}

export function signOutFirebase() {// wylogowywanie z firebase
    return firebase.auth().signOut(); //zwraca promise
}

export async function registerInFirebase(creds) {
    try {
        const result = await firebase.auth().createUserWithEmailAndPassword(creds.email, creds.password); //tworze profil na firebase 
        await result.user.updateProfile({
            displayName: creds.displayName,
        });
        return await setUserProfileData(result.user) //wysyłam profil do firebase
    } catch (error) {
        throw error //wyrzucam error spowrotem do Forma kiedy wywołuję tą metodę
    }
}

export async function socialLogin(selectedProvider) { // Logowanie się przez facebooka i googla
    let provider;
    if (selectedProvider === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider();
    }
    if (selectedProvider === 'google') {
        provider = new firebase.auth.GoogleAuthProvider();
    }
    try {
        const result = await firebase.auth().signInWithPopup(provider); // loguje sie 
        console.log(result);
        if (result.additionalUserInfo.isNewUser){ // jeśli loguje się po raz pierwszy to bedzie boolean true
            await setUserProfileData(result.user);
            
        }
    } catch (error) {
        toast.error(error.message);
    }
}

export function updateUserPassword(creds) {
    const user = firebase.auth().currentUser; //pobieram usera z firebase
    return user.updatePassword(creds.newPassword1); //przypisuję nowe hasło do usera
}

export function uploadToFirebaseStorage(file, filename) {
    const user = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${user.uid}/user_images/${filename}`).put(file);
}

export function deleteFromFirebaseStorage(filename) {
    const userUid = firebase.auth().currentUser.uid;
    const storageRef = firebase.storage().ref();
    const photoRef = storageRef.child(`${userUid}/user_images/${filename}`);
    return photoRef.delete();

}

export function addEventChatComment(eventId, values) {
    const user = firebase.auth().currentUser;
    const newComment = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        text: values.comment,
        date: Date.now(),
        parentId: values.parentId
    }
    return firebase.database().ref(`chat/${eventId}`).push(newComment); // umieszczam nowy komentarz w firebase
}

export function getEventChatRef(eventId) {
    return firebase.database().ref(`chat/${eventId}`).orderByKey()
}