// Import the functions you need from the SDKs you need

// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDKmPbS-dplczSxkRkAJ4lg9vZf3467DTg",
    authDomain: "back-attack-poc.firebaseapp.com",
    projectId: "back-attack-poc",
    storageBucket: "back-attack-poc.firebasestorage.app",
    messagingSenderId: "415017495411",
    appId: "1:415017495411:web:f0e899582d762520c2b306",
    measurementId: "G-HT0ECVG2HJ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = firebase.firestore();

console.log(db);

(async function () {
    // DEBUG:
    if (false) {
        const docRef = await db.collection("test-users").add({
            first: "Matthew",
            last: "Lovelace",
            born: 1815,
        });
        console.log("Document written with ID: ", docRef.id);
    }
})();
