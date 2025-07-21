import admin from 'firebase-admin';
import serviceAccount from '../../../experimentthings-4dcad-firebase-adminsdk-fbsvc-e7a688f8d3.json';

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
        databaseURL:
          'https://experimentthings-4dcad-default-rtdb.firebaseio.com',
        storageBucket: 'experimentthings-4dcad.firebasestorage.app'
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
      throw error;
    }
  }

  return admin;
}

const firebaseAdmin = getFirebaseAdmin();

const db = firebaseAdmin.firestore();
const storage = firebaseAdmin.storage();

export { firebaseAdmin, db, storage };
