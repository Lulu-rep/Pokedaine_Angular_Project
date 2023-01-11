import { removeTaches } from "./api.js";
import { updateTaches } from "./api.js";

export class TacheHtml {

    elementParentHTML;
    tache;
    texte;

    constructor(tache) {
        this.tache = tache;
        this.elementParentHTML = document.createElement('div');

        this.texte = document.createElement('div')
        this.texte.textContent = tache.titre;

        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        if (tache.termine) {
            this.texte.setAttribute("class", "text-decoration-line-through");
            checkbox.setAttribute("checked", "");
        }

        checkbox.addEventListener("click", (e) => {
            this.update();
        })


        let buttonDelete = document.createElement('button');
        buttonDelete.textContent = 'Supprimer';
        buttonDelete.addEventListener('click', e => this.remove());


        this.elementParentHTML.appendChild(checkbox);
        this.elementParentHTML.appendChild(this.texte);
        this.elementParentHTML.appendChild(buttonDelete);
    }

    async remove() {
        await removeTaches(this.tache);
        this.elementParentHTML.remove();
    }

    async update() {
        this.tache.termine = !this.tache.termine;
        await updateTaches(this.tache);
        if (this.tache.termine) {
            this.texte.setAttribute("class", "text-decoration-line-through");
        } else {
            this.texte.setAttribute("class", "")
        }
    }
}