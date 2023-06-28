// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyClVH-3PKP4V4GuXm4d2M5YPZ42VxVt2E0",
	authDomain: "calendarblueoc.firebaseapp.com",
	projectId: "calendarblueoc",
	storageBucket: "calendarblueoc.appspot.com",
	messagingSenderId: "503506119226",
	appId: "1:503506119226:web:ccac6d03b06d4c05b82303",
	measurementId: "G-SS3DBG8MJX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
