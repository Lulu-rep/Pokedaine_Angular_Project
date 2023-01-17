import { Pipe, PipeTransform } from '@angular/core';
import { Tache } from '../model/tache';

@Pipe({
  name: 'filtreTache'
})
export class FiltreTachePipe implements PipeTransform {

  transform(value: Array<Tache>, filter:string): Array<Tache> {
    if (!value) {
      return value;
    }
    switch(filter) {
      case 'undefined':
        return value.filter( tache => tache.statut === 'undefined')
        break;
      case 'enCours':
        return value.filter( tache =>  tache.statut === 'enCours')
        break;
      case 'termine':
        return value.filter( tache =>  tache.statut === 'termine')
        break;
      case 'enAttente':
        return value.filter( tache =>  tache.statut === 'enAttente')
        break;
      default:
        return value;

    }
  }

}
