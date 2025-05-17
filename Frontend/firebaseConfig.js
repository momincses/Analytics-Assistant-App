// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIls96bQJsGlK8hYcrYTK5embOpCUgKiY",
  authDomain: "analytics-assistant-ai.firebaseapp.com",
  projectId: "analytics-assistant-ai",
  storageBucket: "analytics-assistant-ai.firebasestorage.app",
  messagingSenderId: "622468769226",
  appId: "1:622468769226:web:6ac946ee224fa121309b33",
  measurementId: "G-85DV9560F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);