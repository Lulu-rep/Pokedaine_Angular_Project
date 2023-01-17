import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tache } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';
import { UserService } from 'src/app/service/user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {
  taches: Array<Tache> = [];
  undifined: Array<Tache> = [];
  enAttente: Array<Tache> = [];
  enCours: Array<Tache> = [];
  termine: Array<Tache> = [];
  newTache: Tache = {
    titre : '',
    termine : false,
    statut : 'undefined'
  };  
  
  filter:string = 'Tous';

  constructor(private tacheService: TachesService,
    private userService: UserService,
    private router: Router){ }
  
    ngOnInit(): void {
      this.tacheService.getTaches().subscribe({
        next: (data:Array<Tache>) => {
          this.taches = data;
          this.taches.forEach(tache => {
            if(tache.statut == 'enAttente') {
              this.enAttente.push(tache);
            }
            else if(tache.statut == 'enCours') {
              this.enCours.push(tache);
            }
            else if(tache.statut == 'termine') {
              this.termine.push(tache);
            }
            else {
              tache.statut = 'undefined';
              this.undifined.push(tache);
            }
          });
        }
      });
  

  }  

  ajouter(type:string) {
    this.newTache.statut = type;
    this.tacheService.ajoutTaches(this.newTache).subscribe({
      next: (data) => {
        this.taches.push(data);
        if(type == 'enAttente') {
          this.enAttente.push(data);
        }
        else if(type == 'enCours') {
          this.enCours.push(data);
        }
        else if(type == 'termine') {
          this.termine.push(data);
        }
        else{
          this.undifined.push(data);
        }
        this.tacheService.getTaches().subscribe({
          next: (data:Array<Tache>) => { this.taches = data;}
        });
      }
    });
  this.newTache = {
    titre : '',
    termine : false,
    statut : 'undefined'
  };
}  

  supprimer(tache: Tache): void {
    this.tacheService.removeTaches(tache).subscribe({
      next: (data) => {
        this.taches = this.taches.filter(t => tache._id != t._id);
        this.enAttente = this.enAttente.filter(t => tache._id != t._id);
        this.enCours = this.enCours.filter(t => tache._id != t._id);
        this.termine = this.termine.filter(t => tache._id != t._id);
        this.undifined = this.undifined.filter(t => tache._id != t._id);
      }
    });

  }

  modifier(tache: Tache) {
    tache.termine = !tache.termine;
    this.tacheService.updateTaches(tache).subscribe({
      next: (data) => {
      }
    });
  }

  loggout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['']);
    })
  }

  change(filter:string) {
    this.filter = filter;
  }

  drop(event: CdkDragDrop<Tache[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      let tache = event.container.data[event.currentIndex];
      tache.statut = event.container.id;
      this.tacheService.updateTaches(tache).subscribe({
        next: (data) => {
        }
      });
    }
  }

}


