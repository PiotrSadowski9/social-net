/* eslint-disable max-len */

const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();


exports.addFollowing = functions.firestore
    .document("following/{userUid}/userFollowing/{profileId}")
    .onCreate(async (snapshot, context) => {
      const following = snapshot.data();
      console.log({following});
      try {
        // eslint-disable-next-line max-len
        const userDoc = await db.collection("users").doc(context.params.userUid).get();
        const batch = db.batch();
        // eslint-disable-next-line max-len
        batch.set(db.collection("following").doc(context.params.profileId).collection("userFollowers").doc(context.params.userUid), {
          displayName: userDoc.data().displayName,
          photoURL: userDoc.data().photoURL,
          uid: userDoc.id,
        });
        // eslint-disable-next-line no-undef
        batch.update(db.collection("users").doc(context.params.profileId), {
          // eslint-disable-next-line no-undef
          followerCount: admin.firestore.FieldValue.increment(1),
        });
        return await batch.commit();
      } catch (error) {
        return console.log(error);
      }
    });

exports.removeFollowing = functions.firestore
    .document("following/{userUid}/userFollowing/{profileId}")
    .onDelete(async (snapshot, context) => {
      const batch = db.batch();
      // eslint-disable-next-line max-len
      batch.delete(db.collection("following").doc(context.params.profileId).collection("userFollowers").doc(context.params.userUid));
      batch.update(db.collection("users").doc(context.params.profileId), {
        // eslint-disable-next-line no-undef
        followerCount: admin.firestore.FieldValue.increment(-1),
      });
      try {
        return await batch.commit();
      } catch (error) {
        return console.log(error);
      }
    });

exports.eventUpdated = functions.firestore
    .document("events/{eventId}")
    .onUpdate(async (snapshot, context) => {
      const before = snapshot.before.data();
      const after = snapshot.after.data();
      if (before.attendees.length < after.attendees.length) {
        // eslint-disable-next-line max-len
        const attendeeJoined = after.attendees.filter((item1) => !before.attendees.some((item2) =>
          item2.id === item1.id))[0];
        console.log({attendeeJoined});
        try {
          const followerDocs = await db.collection("following").doc(attendeeJoined.id)
              .collection("userFollowers").get();
          followerDocs.forEach((doc) => {
            admin.database().ref(`/posts/${doc.id}`).push(newPost(attendeeJoined, "joined-event", context.params.eventId, before));
          });
        } catch (error) {
          return console.log(error);
        }
      }
      if (before.attendees.length > after.attendees.length) {
        // eslint-disable-next-line max-len
        const attendeeLeft = before.attendees.filter((item1) => !after.attendees.some((item2) =>
          item2.id === item1.id))[0];
        console.log({attendeeLeft});
        try {
          const followerDocs = await db.collection("following").doc(attendeeLeft.id)
              .collection("userFollowers").get();
          followerDocs.forEach((doc) => {
            admin.database().ref(`/posts/${doc.id}`).push(newPost(attendeeLeft, "left-event", context.params.eventId, before));
          });
        } catch (error) {
          return console.log(error);
        }
      }
      return console.log("finished");
    });

// eslint-disable-next-line require-jsdoc
function newPost(user, code, eventId, event) {
  return {
    photoURL: user.photoURL || "/assets/user.png",
    date: admin.database.ServerValue.TIMESTAMP,
    code,
    displayName: user.displayName,
    eventId,
    userUid: user.id,
    title: event.title,
  };
}
