import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://bunkies-app.firebaseio.com",
});

const db = admin.firestore();

export { admin, db };
