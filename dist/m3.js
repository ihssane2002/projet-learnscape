// Importer les modules Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase, ref, get, set, child } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let timer1, timer2, timer3,timer4; // Déclaration des variables timer pour chaque quiz

// Fonction pour démarrer le minuteur du quiz
function startQuizTimer(timerElement, quizCode) {
    let timeLeft = 60; // Définir le temps en secondes
    timerElement.textContent = `Temps restant : ${timeLeft}s`;

    // Décrémenter le temps restant chaque seconde
    const timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Temps restant : ${timeLeft}s`;

        // Si le temps est écoulé, soumettre automatiquement le quiz
        if (timeLeft === 0) {
            clearInterval(timer); // Arrêter le minuteur
            submitQuiz(quizCode); // Soumettre le quiz
        }
    }, 1000);
    return timer; // Retourner l'identifiant du minuteur pour pouvoir l'arrêter plus tard si nécessaire
}

// Fonction pour vérifier le code du quiz
async function verifyCode(quizCode, codeId) {
    console.log(`Vérification du code pour le Quiz ${quizCode}:`, codeId);
    try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `Cours Magistral 3/Quizzes/${codeId}`));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error(`Erreur lors de la vérification du code pour le Quiz ${quizCode}:`, error);
        return null;
    }
}

// Écouter l'événement DOMContentLoaded pour initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    // Écouter l'événement "click" sur le bouton "Participer" du Quiz 1
    document.getElementById('submit-code9').addEventListener('click', async (event) => {
        const codeId = document.getElementById('code-input9').value;
        console.log('Bouton "Participer" du Quiz 1 cliqué');
        console.log('Code ID entré pour le Quiz 1:', codeId);
        const quizData = await verifyCode('Quiz 1', codeId);
        if (quizData) {
            alert('Code ID valide pour le Quiz 1');
            displayQuiz('quiz-container1', quizData);
        } else {
            alert('Code ID invalide pour le Quiz 1');
        }
    });


    // Écouter l'événement "click" sur le bouton "Participer" du Quiz 2
    document.getElementById('submit-code10').addEventListener('click', async (event) => {
        const codeId = document.getElementById('code-input10').value;
        console.log('Bouton "Participer" du Quiz 2 cliqué');
        console.log('Code ID entré pour le Quiz 2:', codeId);
        const quizData = await verifyCode('Quiz 2', codeId);
        if (quizData) {
            alert('Code ID valide pour le Quiz 2');
            displayQuiz('quiz-container2', quizData);
        } else {
            alert('Code ID invalide pour le Quiz 2');
        }
    });
});
// Écouter l'événement DOMContentLoaded pour initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    // Écouter l'événement "click" sur le bouton "Participer" du Quiz 1
    document.getElementById('submit-code11').addEventListener('click', async (event) => {
        const codeId = document.getElementById('code-input11').value;
        console.log('Bouton "Participer" du Quiz 3 cliqué');
        console.log('Code ID entré pour le Quiz 3:', codeId);
        const quizData = await verifyCode('Quiz 3', codeId);
        if (quizData) {
            alert('Code ID valide pour le Quiz 3');
            displayQuiz('quiz-container3', quizData);
        } else {
            alert('Code ID invalide pour le Quiz 3');
        }
    });
    // Écouter l'événement "click" sur le bouton "Participer" du Quiz 3
    document.getElementById('submit-code12').addEventListener('click', async (event) => {
        const codeId = document.getElementById('code-input12').value;
        console.log('Bouton "Participer" du Quiz 4 cliqué');
        console.log('Code ID entré pour le Quiz 4:', codeId);
        const quizData = await verifyCode('Quiz 4', codeId);
        if (quizData) {
            alert('Code ID valide pour le Quiz 4');
            displayQuiz('quiz-container4', quizData); // Correction du conteneur ici
        } else {
            alert('Code ID invalide pour le Quiz 4');
        }
    });
});


// Fonction pour afficher le quiz
function displayQuiz(containerId, quizData) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Créer la barre du quiz avec une classe 'quiz-bar'
    const quizBar = document.createElement('div');
    quizBar.classList.add('quiz-bar');

    // Ajouter le minuteur à la barre du quiz
    const timerElement = document.createElement('div');
    timerElement.classList.add('timer');
    quizBar.appendChild(timerElement);

    // Initialiser le minuteur en fonction du quiz
    if (containerId === 'quiz-container9') {
        timer1 = startQuizTimer(timerElement, 'Quiz 1');
    } else if (containerId === 'quiz-container10') {
        timer2 = startQuizTimer(timerElement, 'Quiz 2');
    } else if (containerId === 'quiz-container11') {
        timer3 = startQuizTimer(timerElement, 'Quiz 3');
    }else if (containerId === 'quiz-container12') {
        timer4 = startQuizTimer(timerElement, 'Quiz 4');
    }

    // Ajouter les questions du quiz à la barre du quiz
    Object.keys(quizData).forEach((questionKey, index) => {
        if (questionKey.startsWith('question')) {
            const questionData = quizData[questionKey];
            const questionNumber = index + 1;
            const questionElement = document.createElement('div');
            questionElement.innerHTML = `
                <p>Question ${questionNumber}: ${questionData.question}</p>
                ${Object.keys(questionData.answers).map(letter => `
                    <label>
                        <input type="radio" name="question${index}" value="${letter}">
                        ${letter}: ${questionData.answers[letter]}
                    </label><br>
                `).join('')}
            `;
            quizBar.appendChild(questionElement);
        }
    });

    // Créer le bouton Soumettre
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Soumettre';
    submitButton.className = 'submit-button';
    submitButton.addEventListener('click', () => submitQuiz(containerId));
    quizBar.appendChild(submitButton);

    // Ajouter la barre du quiz à la page
    container.appendChild(quizBar);

    // Appliquer les effets visuels
    container.classList.add('blur'); // Ajouter un flou à la page principale

    // Afficher la barre du quiz avec une animation
    setTimeout(() => {
        quizBar.classList.add('show');
    }, 100); // Vous pouvez ajuster la durée du délai selon vos besoins
}

// Fonction pour récupérer les données du quiz depuis la base de données Firebase
async function getQuizData(codeId) {
    try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `Cours Magistral 3/Quizzes/${codeId}`));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error('Erreur lors de la récupération des données du quiz:', error);
        return null;
    }
}
/// Fonction pour soumettre les réponses du quiz
async function submitQuiz(containerId) {
    let timer;
    if (containerId === 'quiz-container9') {
        clearInterval(timer1); // Arrêter le minuteur du Quiz 1
        timer = timer1;
    } else if (containerId === 'quiz-container10') {
        clearInterval(timer2); // Arrêter le minuteur du Quiz 2
        timer = timer2;
    } else if (containerId === 'quiz-container11') {
        clearInterval(timer3); // Arrêter le minuteur du Quiz 3
        timer = timer3;
    }else if (containerId === 'quiz-container12') {
        clearInterval(timer4); // Arrêter le minuteur du Quiz 3
        timer = timer4;
    }

    let score = 0;

    // Récupérer les données du quiz depuis la base de données Firebase
    const quizCode = containerId === 'quiz-container9' ? document.getElementById('code-input9').value :
                      containerId === 'quiz-container10' ? document.getElementById('code-input10').value :
                      containerId === 'quiz-container11' ? document.getElementById('code-input11').value :
                      document.getElementById('code-input12').value;

    const quizData = await getQuizData(quizCode);

    if (!quizData) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de récupérer les données du quiz.'
        });
        return;
    }

    let answerList = []; // Initialiser la liste des réponses

    // Comparer les réponses de l'utilisateur avec les réponses correctes
    Object.keys(quizData).forEach((questionKey, index) => {
        if (questionKey.startsWith('question')) {
            const question = quizData[questionKey];
            const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);

            if (selectedAnswer) {
                const userAnswer = selectedAnswer.value.trim().toLowerCase();
                answerList.push(userAnswer); // Ajouter la réponse sélectionnée à la liste des réponses

                // Normaliser les clés des réponses en minuscules
                const normalizedAnswers = {};
                Object.keys(question.answers).forEach(key => {
                    normalizedAnswers[key.toLowerCase()] = question.answers[key];
                });

                if (normalizedAnswers.hasOwnProperty(userAnswer)) {
                    const userAnswerText = normalizedAnswers[userAnswer].trim().toLowerCase();
                    const correctAnswer = question.correctAnswer.trim().toLowerCase();

                    if (userAnswerText === correctAnswer) {
                        score++;
                    }
                }
            }
        }
    });

    // Calculer le pourcentage de bonnes réponses
    const totalQuestions = Object.keys(quizData).filter(key => key.startsWith('question')).length;
    const percentage = (score / totalQuestions) * 100;

    // Afficher le score de l'utilisateur avec SweetAlert2
    Swal.fire({
        icon: 'success',
        title: 'Résultat du Quiz',
        text: `Votre score est de : ${score} / ${totalQuestions}`,
        showConfirmButton: true,
        confirmButtonText: 'OK'
    });

    // Supprimer le contenu du conteneur du quiz
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Retirer les classes CSS pour restaurer l'apparence normale de la page
    container.classList.remove('blur');

    // Appeler la fonction pour enregistrer les résultats du quiz
    console.log(`Quiz Code: ${quizCode}`); // Vérifier que quizCode est bien défini
    try {
        // Référence à l'emplacement pour stocker les résultats du quiz
        const resultsRef = ref(database, `Results/${quizCode}`);

        // Récupérer le dernier numéro d'entrée et l'incrémenter
        const snapshot = await get(resultsRef);
        let entryNumber = 1; // Valeur par défaut pour la première entrée

        if (snapshot.exists()) {
            // S'il y a des données existantes, trouver le dernier numéro d'entrée
            const entries = Object.keys(snapshot.val()); // Obtenir les clés des entrées existantes
            entryNumber = entries.length + 1; // Incrémenter pour la nouvelle entrée
        }

        // Créer une référence pour la nouvelle entrée dans results/quizCode/entryNumber
        const newEntryRef = ref(database, `Results/${quizCode}/${entryNumber}`);

        // Enregistrer les données du quiz dans la nouvelle entrée
        await set(newEntryRef, {
            answersList: answerList,
            percentage: percentage
        });

        console.log(`Résultats du quiz enregistrés avec succès pour ${quizCode}, entrée ${entryNumber}`);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des résultats du quiz:', error);
    }



    // Fonction pour obtenir le nom d'utilisateur sans la partie email après "@"
    function getUserName(user) {
        return user.displayName || user.email.split('@')[0];  // Utiliser le nom d'affichage ou la partie avant "@"
    }

    // Sauvegarder la date et le score dans Firebase dans l'emplacement quizdate
    const date = new Date(); // Obtenir la date actuelle
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            const userName = getUserName(user);

            try {
                // Créer une référence à l'emplacement pour stocker la date et le score du quiz
                const quizDateRef = ref(database, `quizdate/${quizCode}/${userId}`);

                // Enregistrer la date et le score dans Firebase
                await set(quizDateRef, {
                    date: date.toISOString(),  // Enregistrer la date au format ISO
                    score: score  // Enregistrer le score obtenu
                });

                console.log(`Date et score du quiz enregistrés avec succès pour l'utilisateur ${userId} et le quiz ${quizCode}`);
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement de la date et du score du quiz:', error);
            }

            try {
                // Créer une référence à l'emplacement pour stocker les scores des utilisateurs
                const userScoresRef = ref(database, `userScores/${userId}`);
                const snapshot = await get(userScoresRef);

                if (snapshot.exists()) {
                    let userScores = snapshot.val();

                    // Assurer que userScores est un tableau
                    if (!Array.isArray(userScores)) {
                        userScores = []; // Initialiser avec un tableau vide si ce n'est pas le cas
                    }

                    // Vérifier si l'utilisateur a déjà un score pour ce quiz
                    const existingScoreIndex = userScores.findIndex(scoreObj => scoreObj.quizCode === quizCode);
                    if (existingScoreIndex !== -1) {
                        // Mettre à jour le score existant
                        userScores[existingScoreIndex].score += score;
                    } else {
                        // Ajouter un nouveau score avec le nom d'utilisateur et le code du quiz
                        userScores.push({ quizCode, score, userName });
                    }

                    // Mettre à jour les scores dans la base de données
                    await set(userScoresRef, userScores);
                } else {
                    // Créer une nouvelle entrée de score pour l'utilisateur
                    await set(userScoresRef, [{ quizCode, score, userName }]);
                }

                console.log(`Score de l'utilisateur ${userName} mis à jour avec succès.`);
            } catch (error) {
                console.error('Erreur lors de la mise à jour du score de l\'utilisateur:', error);
            }
        } else {
            console.error('Utilisateur non authentifié.');
        }
    });
}
