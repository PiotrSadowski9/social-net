import cuid from 'cuid';
import firebase from '../config/firebase';

const db = firebase.firestore();

export function dataFromSnapshot(snapshot) {
    if (!snapshot.exists) return undefined; //property od razu otrzymana z snapshot
    const data = snapshot.data();

    for (const prop in data) { //sprawdzanie czy w prop danych jest data (w seknundach od 1970) i zamiana formatu na normalna datę
        if (data.hasOwnProperty(prop)) {
            if (data[prop] instanceof firebase.firestore.Timestamp) { // jeśli data jest Timestamp to mamy dostep do prop toDate();
                data[prop] = data[prop].toDate();


            }
        }
    }
    
    return {
        ...data,
        id:snapshot.id
    }
}

export function listenToEventsFromFirestore() {
    return db.collection('events').orderBy('date') //Sprawdzam czy działa, segreguję po dacie
}



export function listenToEventFromFirestore(eventId) { // pozwala zapytać o individual event a nie collection
    return db.collection('events').doc(eventId)
}

export function addEventToFirestore(event) {  //funckcja dodawania do Firestora zwraca Promise
    return db.collection('events').add({
        ...event,
        hostedBy: 'Diana',
        hostPhotoURL: 'https://randomuser.me/api/portraits/women/20.jpg',
        attendees: firebase.firestore.FieldValue.arrayUnion({
            id: cuid(),
            displayName: 'Diana',
            photoURL: 'https://randomuser.me/api/portraits/women/20.jpg'
        }) //coś jak array.push 
    })
}

export function updateEventInFirestore(event) {
    return db.collection('events').doc(event.id).update(event)
}

export function deleteEventInFirestore(eventId) {
    return db.collection('events').doc(eventId).delete();
}

export function cancelEventToggle(event) {
    return db.collection('events').doc(event.id).update({
        isCancelled: !event.isCancelled
    })
}

export function setUserProfileData(user) {//dodaję do database w firebase  nową collection 'user'
    return db.collection('users').doc(user.uid).set({ 
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
}

export function getUserProfile(userId) {
    return db.collection('users').doc(userId);
}

//updatowanie profilu usera w firestore

export async function updateUserProfile(profile) {
    const user = firebase.auth().currentUser;
    try {
        if (user.displayName !== profile.displayName) {
            await user.updateProfile({
                displayName: profile.displayName
            })
            
        }
        return await db.collection('users').doc(user.uid).update(profile);   
    } catch (error) {
        throw error
    }
}

export async function updateUserProfilePhoto(downloadURL, filename) {
    const user = firebase.auth().currentUser;
    const userDocRef = db.collection('users').doc(user.uid);
    try {
        const userDoc = await userDocRef.get();
        if (!userDoc.data().photoURL) {
            await db.collection('users').doc(user.uid).update({
                photoURL:downloadURL
            });
            await user.updateProfile({
                photoURL: downloadURL
            })
        }
        return await db.collection('users').doc(user.uid).collection('photos').add({
            name: filename,
            url: downloadURL
        })
    } catch (error) {
        throw error;
    }
}

export function getUserPhotos(userUid) {
    return db.collection('users').doc(userUid).collection('photos');
}