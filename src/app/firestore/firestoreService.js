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