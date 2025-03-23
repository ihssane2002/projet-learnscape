// Importer les modules Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, push, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Votre configuration Firebase
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
const db = getDatabase(app);
const auth = getAuth(app);

// Référence aux éléments HTML
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

const questionForm = document.getElementById('question-form');
const questionInput = document.getElementById('question-input');
const forumQuestions = document.getElementById('forum-questions');

let currentUser = null;

// Observer l'état d'authentification
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    window.location.href = 'login.html';
  }
});

// Fonction pour obtenir le nom d'utilisateur sans la partie email après "@"
function getUserName(user) {
  return user.displayName || user.email.split('@')[0];  // Utiliser le nom d'affichage ou la partie avant "@"
}

// Fonction pour ajouter un message au chat
function addMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message-item');
  if (message.user === getUserName(currentUser)) {
    div.classList.add('user-message');
  }
  div.innerHTML = `
    <div class="message-info"><span>${new Date(message.timestamp).toLocaleString()}</span></div>
    <span class="message-user">${message.user}</span>: ${message.text}
  `;
  chatMessages.appendChild(div);
}

// Fonction pour ajouter une question au forum
function addQuestion(question) {
  const div = document.createElement('div');
  div.classList.add('question-item');
  if (question.user === getUserName(currentUser)) {
    div.classList.add('user-question');
  }
  div.innerHTML = `
    <div class="question-info"><span>${new Date(question.timestamp).toLocaleString()}</span></div>
    <span class="question-user">${question.user}</span>: ${question.text}
  `;
  forumQuestions.appendChild(div);
}

// Fonction pour afficher une notification
function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

// Demander la permission de notification
if (Notification.permission === 'default') {
  Notification.requestPermission();
}

// Écouter l'envoi du formulaire de message
if (messageForm) {
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    if (currentUser) {
      try {
        // Ajouter le message à Realtime Database
        await push(ref(db, 'messages'), {
          text: messageText,
          user: getUserName(currentUser),
          timestamp: Date.now()
        });
        messageInput.value = ''; // Effacer le champ après envoi
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
      }
    }
  });
}

// Écouter l'envoi du formulaire de question
if (questionForm) {
  questionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const questionText = questionInput.value.trim();
    if (questionText === '') return;

    if (currentUser) {
      try {
        // Ajouter la question à Realtime Database
        await push(ref(db, 'questions'), {
          text: questionText,
          user: getUserName(currentUser),
          timestamp: Date.now()
        });
        questionInput.value = ''; // Effacer le champ après envoi
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la question:', error);
      }
    }
  });
}

// Écouter les modifications sur la collection 'messages'
onChildAdded(ref(db, 'messages'), (snapshot) => {
  const message = snapshot.val();
  addMessage(message);
  showNotification('Nouveau message', `${message.user}: ${message.text}`);
});

// Écouter les modifications sur la collection 'questions'
onChildAdded(ref(db, 'questions'), (snapshot) => {
  const question = snapshot.val();
  addQuestion(question);
  showNotification('Nouvelle question', `${question.user}: ${question.text}`);
});
