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
      case 'Actif':
        return value.filter( tache =>  !tache.termine)
        break;
      case 'Termine':
        return value.filter( tache =>  tache.termine)
      case 'Tous':
        return value;
        break;
      default:
        return value;

    }
  }

}
