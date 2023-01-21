import { Tache } from 'src/app/model/tache';
export interface liste {
    _id?:string;
    titre:string;
    taches:Array<string>;
    tachesliste:Array<Tache>;
}

export interface listeDB {
    _id?:string;
    titre:string;
    taches:Array<string>;
}