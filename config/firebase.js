const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('../andavarcon-firebase-adminsdk.json'); 

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseURL: process.env.FIREBASE_DATABSE_URL,
});

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();
const bucket = admin.storage().bucket();

module.exports = { admin, auth, db, storage, bucket };
