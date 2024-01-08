// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUF3kdKb_1fISSCaMHCfOOZAaOCCxCsWM",
    authDomain: "mern-blog-bc39f.firebaseapp.com",
    projectId: "mern-blog-bc39f",
    storageBucket: "mern-blog-bc39f.appspot.com",
    messagingSenderId: "365413404179",
    appId: "1:365413404179:web:29d54253a3f37e9db939e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google auth
const googleAuthProvider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, googleAuthProvider)
        .then((result) => {
            user = result.user;
        }).catch((error) => {
            console.log(error);
        })

    return user;
}