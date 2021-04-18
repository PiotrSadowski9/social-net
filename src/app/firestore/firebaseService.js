import firebase from '../config/firebase';

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
        return await result.user.updateProfile({
            displayName: creds.displayName,
        })
    } catch (error) {
        throw error //wyrzucam error spowrotem do Forma kiedy wywołuję tą metodę
    }
}