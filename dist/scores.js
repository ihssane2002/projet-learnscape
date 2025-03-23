// Importer les modules Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
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

// Fonction pour calculer le score total et mettre à jour 'Scores'
async function updateTotalScores() {
    try {
        // Récupérer les scores de tous les utilisateurs depuis 'userScores'
        const userScoresRef = ref(database, 'userScores');
        const snapshot = await get(userScoresRef);

        if (snapshot.exists()) {
            const allUserScores = snapshot.val();
            const userIds = Object.keys(allUserScores);

            // Calculer le score total pour chaque utilisateur
            for (const userId of userIds) {
                const userQuizzes = allUserScores[userId];
                let totalScore = 0;

                for (const quizCode in userQuizzes) {
                    totalScore += userQuizzes[quizCode].score;
                }

                // Mettre à jour le score total dans 'Scores'
                const userTotalScoreRef = ref(database, `Scores/${userId}`);
                await set(userTotalScoreRef, { value: totalScore });
            }

            console.log('Scores totaux mis à jour avec succès.');
        } else {
            console.log('Aucun score de quiz trouvé.');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des scores totaux :', error);
    }
}

// Fonction pour récupérer les scores de l'utilisateur et afficher le classement
async function displayUserScoreAndRanking() {
    // Attendre que l'utilisateur soit authentifié
    await new Promise(resolve => {
        onAuthStateChanged(auth, user => {
            if (user) {
                resolve(user);
            } else {
                console.error('Utilisateur non authentifié.');
                resolve(null);
            }
        });
    });

    const user = auth.currentUser;
    if (!user) {
        console.error('Utilisateur non trouvé.');
        return;
    }

    const userId = user.uid;

    try {
        // Mettre à jour les scores totaux avant d'afficher le classement
        await updateTotalScores();

        // Récupérer les scores de tous les utilisateurs depuis 'Scores'
        const scoresRef = ref(database, 'Scores');
        const snapshot = await get(scoresRef);

        if (snapshot.exists()) {
            const allUserScores = snapshot.val();
            const totalScores = Object.keys(allUserScores).map(userId => {
                return { userId, totalScore: allUserScores[userId].value || 0 };
            });

            // Trier les utilisateurs par score décroissant
            totalScores.sort((a, b) => b.totalScore - a.totalScore);

            // Trouver le score total et le classement de l'utilisateur actuel
            const currentUserScore = totalScores.find(userScore => userScore.userId === userId);
            const currentUserRank = totalScores.findIndex(userScore => userScore.userId === userId) + 1;

            // Afficher le score et le classement dans la page
            const scoreInfoElement = document.getElementById('score-info');
            scoreInfoElement.innerHTML = `
                <div class="score-item">
                    <span>Votre Score Total :</span> ${currentUserScore ? currentUserScore.totalScore : 0}
                </div>
                <div class="score-item">
                    <span>Classement :</span> ${currentUserScore ? currentUserRank : 'N/A'}
                </div>
            `;
        } else {
            console.log('Aucun score trouvé.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des scores des utilisateurs :', error);
    }
}

// Appeler la fonction pour afficher les scores et le classement lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    displayUserScoreAndRanking();
});
