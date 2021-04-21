import firebase from '../config/firebase';
import { setUserProfileData } from './firestoreService';

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