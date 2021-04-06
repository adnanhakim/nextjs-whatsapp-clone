import firebase from 'firebase';

const firebaseConfig = {
   apiKey: 'AIzaSyCso5XNh60IagOsOOov9zNRBnhSpoURM6A',
   authDomain: 'whatsapp-clone-1367a.firebaseapp.com',
   projectId: 'whatsapp-clone-1367a',
   storageBucket: 'whatsapp-clone-1367a.appspot.com',
   messagingSenderId: '23361851486',
   appId: '1:23361851486:web:839f5f71ab2fb6e16ae4cf',
   measurementId: 'G-9SE08DQDQG',
};

const app = !firebase.apps.length
   ? firebase.initializeApp(firebaseConfig)
   : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
