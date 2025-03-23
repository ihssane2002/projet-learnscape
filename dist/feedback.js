import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Configuration Firebase
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

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Variable globale pour stocker l'email du professeur
let currentProfEmail = '';

// Fonction pour formater la date et l'heure au format souhaité
function formatDate(date) {
    const pad = (num) => (num < 10 ? '0' + num : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedback-form');
    const confirmationFeedback = document.getElementById('confirmation-feedback');
    const responsesBtn = document.getElementById('responses-btn');
    const responsesContent = document.getElementById('responses-content');
    const responsesBox = document.getElementById('responses-box');
    const scrollIcons = document.getElementById('scroll-icons');

    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailProfInput = document.getElementById('prof-email');
        const feedbackTextInput = document.getElementById('feedback-text');

        if (!emailProfInput || !feedbackTextInput) {
            console.error("Les éléments nécessaires pour le formulaire de feedback ne sont pas présents dans le DOM.");
            return;
        }

        const emailProf = emailProfInput.value.replace(/\./g, ',');
        const feedbackText = feedbackTextInput.value.trim();
        const timestamp = formatDate(new Date());

        try {
            const feedbackRef = ref(db, `FeedBack/${emailProf}/${timestamp}`);

            await set(feedbackRef, {
                feedback: feedbackText,
               
            });

            confirmationFeedback.style.display = 'block';
            setTimeout(() => {
                confirmationFeedback.style.display = 'none';
            }, 3000);
            feedbackForm.reset();

            currentProfEmail = emailProf;
        } catch (error) {
            console.error("Erreur lors de l'envoi du feedback :", error);
        }
    });

    responsesBtn.addEventListener('click', async () => {
        if (!currentProfEmail) {
            console.error("Aucun e-mail de professeur n'a été enregistré pour afficher les réponses.");
            return;
        }

        try {
            const feedbackRef = ref(db, `FeedBack/${currentProfEmail}`);

            onValue(feedbackRef, (snapshot) => {
                responsesContent.innerHTML = '';

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let foundFeedbackWithResponse = false;

                    Object.entries(data).forEach(([timestamp, feedback]) => {
                        if (feedback.responses) {
                            const question = feedback.feedback || "Pas de question définie";
                            const response = feedback.responses || "Pas de réponse";

                            const feedbackElement = document.createElement('div');
                            feedbackElement.classList.add('feedback-item');
                            feedbackElement.innerHTML = `
                            <p>Email: ${currentProfEmail}</p>
                                <p>Question: ${question}</p>
                                <p>Réponse: ${response}</p>
                                <hr>
                            `;
                            responsesContent.appendChild(feedbackElement);
                            foundFeedbackWithResponse = true;
                        }
                    });

                    if (foundFeedbackWithResponse) {
                        responsesBox.style.display = 'block';
                        scrollIcons.style.display = 'block';
                    } else {
                        responsesContent.innerHTML = '<p>Aucun feedback trouvé avec des réponses pour cet email.</p>';
                        responsesBox.style.display = 'block';
                        scrollIcons.style.display = 'none';
                    }
                } else {
                    responsesContent.innerHTML = '<p>Aucun feedback trouvé pour cet email.</p>';
                    responsesBox.style.display = 'block';
                    scrollIcons.style.display = 'none';
                }
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des réponses :", error);
            responsesContent.innerHTML = '<p>Erreur lors de la récupération des réponses.</p>';
            responsesBox.style.display = 'block';
            scrollIcons.style.display = 'none';
        }
    });
});

function scrollContent(direction) {
    const container = document.getElementById('responses-content');

    switch (direction) {
        case 'up':
            container.scrollTop -= 50;
            break;
        case 'down':
            container.scrollTop += 50;
            break;
        case 'left':
            container.scrollLeft -= 50;
            break;
        case 'right':
            container.scrollLeft += 50;
            break;
        default:
            break;
    }
}
