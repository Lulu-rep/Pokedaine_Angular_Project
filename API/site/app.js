import { TacheHtml } from "./tacheHtml.js";
import { ajoutTaches } from "./api.js";

export class Application {

    listeTachesHtml;

    constructor(taches) {

        // récupère l'élément HTML d'id listeTaches
        this.listeTachesHtml = document.getElementById('listeTaches');

        // Boucle sur toutes les taches
        taches.forEach(todo => {
            //Pour chaque tache on crée une balise HTML div contenant le titre de la tache
            let tacheHtml = new TacheHtml(todo);
            // On attache ce nouvel élément HTML à la div
            this.listeTachesHtml.appendChild(tacheHtml.elementParentHTML);
        });

        const buttonAdd = document.getElementById("buttonAjoutTache");
        buttonAdd.addEventListener("click", (e) => { //async (e) => {
            let inputAjoutTache = document.getElementById('inputAjoutTache');
            let maTache = { "titre": inputAjoutTache.value, "termine": false };
            ajoutTaches(maTache).then((rep) => {
                console.log(rep);
                maTache._id = rep.insertedId;
                let tacheHtml = new TacheHtml(maTache);
                this.listeTachesHtml.appendChild(tacheHtml.elementParentHTML);
            });
            // let rep = await ajoutTaches(maTache);
            // maTache._id = rep.id;
            // this.listeTachesHtml.appendChild(tacheHtml.elementParentHTML);     
        });
    }
}