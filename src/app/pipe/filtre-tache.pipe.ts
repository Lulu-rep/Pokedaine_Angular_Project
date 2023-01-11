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
      case '':
        return value.filter( tache => tache.statut === '')
        break;
      case 'en cours':
        return value.filter( tache =>  tache.statut === 'en cours')
        break;
      case 'termine':
        return value.filter( tache =>  tache.statut === 'termine')
        break;
      case 'en attente':
        return value.filter( tache =>  tache.statut === 'en attente')
        break;
      default:
        return value;

    }
  }

}
