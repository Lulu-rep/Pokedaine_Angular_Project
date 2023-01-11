// // récupère la liste des tâches à partir du webService de l'exercice1
// const todosJson = await fetch('http://127.0.0.1:3000/taches');
// const todos = await todosJson.json();
// // récupère l'élément HTML d'id listeTaches
// let listeTachesHtml = document.getElementById('listeTaches');

// // Boucle sur toutes les taches
// todos.forEach(todo => {
//     //Pour chaque tache on crée une balise HTML div contenant le titre de la tache
//     let tacheHtml = document.createElement('div');
//     tacheHtml.textContent = todo.titre
//         // On attache ce nouvel élément HTML à la div
//     listeTachesHtml.appendChild(tacheHtml);
// });

import { getTaches } from "./api.js";
import { Application } from "./app.js";

// récupère la liste des tâches à partir du webService de l'exercice1
const taches = await getTaches();

let app = new Application(taches);