// Importer les modules Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

// Votre configuration Firebase
const firebaseConfig= {
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
const database = getDatabase(app);
const auth = getAuth(app);

// Fonction pour récupérer les données de quiz pour l'utilisateur
async function fetchQuizData(userId) {
    try {
        const quizData = {};
        const quizRef = ref(database, 'quizdate');
        const snapshot = await get(quizRef);
        const allQuizData = snapshot.val();

        for (const quizId in allQuizData) {
            if (allQuizData.hasOwnProperty(quizId)) {
                const userQuizData = allQuizData[quizId][userId];
                if (userQuizData) {
                    quizData[quizId] = userQuizData;
                }
            }
        }

        console.log('Quiz data:', quizData); // Log pour vérifier les données récupérées
        return quizData;
    } catch (error) {
        console.error('Erreur lors du chargement des données de quiz :', error);
        return {};
    }
}

// Tableau des noms de mois
const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
 function highlightQuizDays(quizData, currentDate) {
    const days = document.querySelectorAll('.calendar-day');
    const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth();
                    
                        // Calculer le score total
                        let totalScore = 0;
                    
                        days.forEach(dayDiv => {
                            const day = parseInt(dayDiv.textContent, 10);
                            const monthYear = monthNames[currentMonth] + ' ' + currentYear;
                    
                            let dayScore = 0;
                            let dayColored = false;
                    
                            // Vérifier que le jour appartient au mois en cours
                            if (day > 0 && day <= new Date(currentYear, currentMonth + 1, 0).getDate() && dayDiv.classList.contains(monthYear)) {
                                // Réinitialiser le jour
                                dayDiv.classList.remove('quiz-day');
                                dayDiv.title = '';
                    
                                // Parcourir les données de quiz
                                for (const quizId in quizData) {
                                    if (quizData.hasOwnProperty(quizId)) {
                                        const quizInfo = quizData[quizId];
                                        const quizDate = new Date(quizInfo.date);
                                        const quizYear = quizDate.getFullYear();
                                        const quizMonth = quizDate.getMonth();
                                        const quizDay = quizDate.getDate();
                    
                                        // Vérifier si la date du quiz correspond au jour actuel du calendrier
                                        if (quizYear === currentYear && quizMonth === currentMonth && quizDay === day) {
                                            dayDiv.classList.add('quiz-day');
                                            dayDiv.title = `Score: ${quizInfo.score}`;
                                            dayScore += quizInfo.score;
                                            dayColored = true;
                                            console.log(`Highlighted day: ${day}-${currentMonth + 1}-${currentYear}, Score: ${quizInfo.score}`);
                                            break; // Sortir de la boucle dès qu'un quiz est trouvé
                                        }
                                    }
                                }
                            } else {
                                // Si le jour n'appartient pas au mois en cours, le décolorer s'il est colorié
                                if (dayDiv.classList.contains('quiz-day')) {
                                    dayDiv.classList.remove('quiz-day');
                                    dayDiv.title = '';
                                }
                            }
                    
                            // Ajouter le score du jour au titre
                            if (dayScore > 0) {
                                dayDiv.title = `${dayDiv.title} (Total score: ${dayScore})`;
                                dayDiv.textContent += ` (${dayScore})`;
                            }
                    
                            totalScore += dayScore;
                        });
                    
                        // Afficher le score total
                        console.log('Total Score:', totalScore);
                    }
                    
// Fonction principale exécutée lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            renderCalendar(); // Assurez-vous que cette fonction est définie ailleurs dans votre code
            const quizData = await fetchQuizData(userId);
            const currentDate = new Date(); // La date actuelle
            highlightQuizDays(quizData, currentDate);
        } else {
            console.log('Utilisateur non authentifié');
            // Gestion des utilisateurs non authentifiés
        }
    });
});
