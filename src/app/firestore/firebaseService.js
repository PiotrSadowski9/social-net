import { toast } from 'react-toastify';
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