// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArw7HEQe5iEtoeYdB4IUfLdBfw46uOG3o",
  authDomain: "scic-job-task-90af5.firebaseapp.com",
  projectId: "scic-job-task-90af5",
  storageBucket: "scic-job-task-90af5.appspot.com",
  messagingSenderId: "1003314534564",
  appId: "1:1003314534564:web:d4b37099932d6906792e31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;