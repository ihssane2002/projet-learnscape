import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBw9xAnYTlXw9BOL-Jna7I_6vnEj-UWT1Q",
  authDomain: "lbyd-5e8c3.firebaseapp.com",
  databaseURL: "https://lbyd-5e8c3-default-rtdb.firebaseio.com",
  projectId: "lbyd-5e8c3",
  storageBucket: "lbyd-5e8c3.appspot.com",
  messagingSenderId: "863591467521",
  appId: "1:863591467521:web:e866097eb7fbdc68370e00",
  measurementId: "G-2KKHE2SRWQ"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sélection des éléments
const emailInputEl = document.getElementById("email");
const passwordInputEl = document.getElementById("password");
const signupAccountButtonEl = document.getElementById("signup");
const registerAccountButtonEl = document.getElementById("register");

// Ajout des écouteurs d'événements
signupAccountButtonEl.addEventListener("click", authSignupAccountWithEmail);
registerAccountButtonEl.addEventListener("click", authRegisterAccountWithEmail);

function authSignupAccountWithEmail() {
  const email = emailInputEl.value;
  const password = passwordInputEl.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('Utilisateur connecté:', userCredential);
      console.log('Redirection en cours...');
     location.replace('quiz_questions.html');
    })
    .catch((error) => {
      console.error('Erreur lors de la connexion:', error.message);
      alert('Erreur: ' + error.message);
    });
}

function authRegisterAccountWithEmail() {
  const email = emailInputEl.value;
  const password = passwordInputEl.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('Utilisateur inscrit:', userCredential);
      console.log('Redirection en cours...');
     location.replace('quiz_questions.html');

    })
    .catch((error) => {
      console.error('Erreur lors de l\'inscription :', error.message);
      alert('Erreur: ' + error.message);
    });
}
