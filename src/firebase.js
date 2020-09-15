import * as firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBFuW3xGaUYzEt3vDadrd1TU7INgBlxeIM",
    authDomain: "twitter-is-a-waste-of-time.firebaseapp.com",
    databaseURL: "https://twitter-is-a-waste-of-time.firebaseio.com",
    projectId: "twitter-is-a-waste-of-time",
    storageBucket: "twitter-is-a-waste-of-time.appspot.com",
    messagingSenderId: "336256584877",
    appId: "1:336256584877:web:e2ca7b65ff822667184a24"
};

export default firebase.initializeApp(firebaseConfig);