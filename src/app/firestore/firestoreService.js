
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
        id: snapshot.id
    }
}

export function listenToEventsFromFirestore(predicate) {
    const user = firebase.auth().currentUser;
    let eventsRef = db.collection('events').orderBy('date') //Sprawdzam czy działa, segreguję po dacie
    
    switch (predicate.get('filter')) { //filtruję eventy
        case 'isGoing':
            
            return eventsRef
                .where('attendeeIds', 'array-contains', user.uid)
                .where('date', '>=', predicate.get('startDate'));
        case 'isHost':
          
            return eventsRef
                .where('hostUid', '==', user.uid)
                .where('date', '>=', predicate.get('startDate'));
        default:
            
            return eventsRef.where('date', '>=', predicate.get('startDate'));
    }
}



export function listenToEventFromFirestore(eventId) { // pozwala zapytać o individual event a nie collection
    return db.collection('events').doc(eventId)
}

export function addEventToFirestore(event) {  //funckcja dodawania do Firestora zwraca Promise
    const user = firebase.auth().currentUser;
    return db.collection('events').add({
        ...event,
        hostUid: user.uid,
        hostedBy: user.displayName,
        hostPhotoURL: user.photoURL || null,
        attendees: firebase.firestore.FieldValue.arrayUnion({
            id: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || null
        }), //coś jak array.push
        attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid) 
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
                photoURL: downloadURL
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

export async function setMainPhoto(photo) {
    const user = firebase.auth().currentUser;
    try {
        await db.collection('users').doc(user.uid).update({
            photoURL: photo.url
        })
        return await user.updateProfile({
            photoURL: photo.url
        })
    } catch (error) {
        throw error;
    }
}

export function deletePhotoFromCollection(photoId) {
    const userUid = firebase.auth().currentUser.uid;
    return db.collection('users').doc(userUid).collection('photos').doc(photoId).delete();
}

export function addUserAttendance(event) {
    const user = firebase.auth().currentUser;
    return db.collection('events').doc(event.id).update({
        attendees: firebase.firestore.FieldValue.arrayUnion({
            id: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || null
        }), //coś jak array.push
        attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid) 
    })
}

export async function cancelUserAttendance(event) {
    const user = firebase.auth().currentUser;
    try {
        const eventDoc = await db.collection('events').doc(event.id).get();
        return db.collection('events').doc(event.id).update({
            attendeeIds: firebase.firestore.FieldValue.arrayRemove(user.uid),
            attendees: eventDoc.data().attendees.filter(attendee => attendee.id !== user.uid)

        })
    } catch (error) {
        throw error;
    }
}

export function getUserEventsQuery(activeTab, userUid) {
    let eventsRef = db.collection('events');
    const today = new Date();
    switch (activeTab) {
        case 1://past events
            return eventsRef
            .where('attendeeIds', 'array-contains', userUid)
            .where('date', '<=', today)
            .orderBy('date', 'desc')
        case 2: //hosting events
            return eventsRef
            .where('hostUid', '==', userUid)
            .orderBy('date')
        default: 
            return eventsRef
            .where('attendeeIds', 'array-contains', userUid)
            .where('date', '>=', today)
            .orderBy('date')
    }
}

export async function followUser(profile) {
    const user = firebase.auth().currentUser;
    const batch = db.batch();
    try {
        batch.set(db.collection('following').doc(user.uid).collection('userFollowing').doc(profile.id),{
            displayName: profile.displayName,
            photoURL: profile.photoURL,
            uid: profile.id
        });
        batch.update(db.collection('users').doc(user.uid),{
            followingCount: firebase.firestore.FieldValue.increment(1)
        })
        return await batch.commit();
    } catch (error) {
        throw error
    }
}

export async function unfollowUser(profile) {
    const user = firebase.auth().currentUser;
    const batch = db.batch();
    try {
        batch.delete(db.collection('following').doc(user.uid).collection('userFollowing').doc(profile.id));
        
        batch.update(db.collection('users').doc(user.uid),{
            followingCount: firebase.firestore.FieldValue.increment(-1)
        })
        
        return await batch.commit();
    } catch (error) {
        throw error;
    }
}

export function getFollowersCollection(profileId) {
    return db.collection('following').doc(profileId).collection('userFollowers')
}

export function getFollowingCollection(profileId) {
    return db.collection('following').doc(profileId).collection('userFollowing')
}

export function getFollowingDoc(profileId) {
    const userUid = firebase.auth().currentUser.uid;
    return db.collection('following').doc(userUid).collection('userFollowing').doc(profileId).get();
}