
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
        batch.update(db.collection("users").doc(profile.id), {
          // eslint-disable-next-line no-undef
          followerCount: firebase.firestore.FieldValue.increment(1),
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
        followerCount: firebase.firestore.FieldValue.increment(-1),
      });
      try {
        return await batch.commit();
      } catch (error) {
        return console.log(error);
      }
    });
