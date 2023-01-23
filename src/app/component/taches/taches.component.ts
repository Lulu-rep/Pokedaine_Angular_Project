import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tache } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';
import { UserService } from 'src/app/service/user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { liste, listeDB } from 'src/app/model/list';


@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {
  liste2: Array<liste> = [];
  newTache: Array<Tache> = [];
  newListe: listeDB = {
    titre: '',
    taches: [],
  };
  newListeAdd: liste = {
    titre: '',
    taches: [],
    tachesliste: [],
  };



  filter: string = 'Tous';


  constructor(private tacheService: TachesService,
    private userService: UserService,
    private router: Router) { }

    ngOnInit(): void {
      this.tacheService.getListes().subscribe({
        next: (data2: Array<liste>) => {
          this.liste2 = data2;
          this.liste2.forEach(liste => {
            this.newTache.push({
              titre: '',
              termine: false,
              statut: liste.titre
              });
            liste.tachesliste = [];
            liste.taches.forEach(tache => {
              this.tacheService.getTaches().subscribe({
                next: (data: Array<Tache>) => {
                  data.forEach(tache2 => {
                    if (tache2._id == tache) {
                      liste.tachesliste.push(tache2);
                    }
                  });
                }
              });
            });
          });
        }
      });
    }
  


  ajouter(liste: liste) {
    let index = this.liste2.indexOf(liste);
    if (liste.tachesliste == undefined) {
      liste.tachesliste = [];
    }
    this.newTache[index].statut = liste.titre;
    console.log(this.newTache[index]);
    this.tacheService.ajoutTaches(this.newTache[index]).subscribe({
      next: (data: Tache) => {
        let id = data._id as string;
        console.log(id);
        console.log(liste.taches);
        console.log(liste.taches.length);
        if (liste.taches.length == 0) {
          liste.taches = [id];
        } else {
          liste.taches.push(id);
        }
        if (liste.tachesliste.length == 0) {
          liste.tachesliste = [data];
        } else {
          liste.tachesliste.push(data);
        }
        console.log(this.liste2)
        console.log(liste.tachesliste);
        console.log(liste.taches);
        let liste3: listeDB;
        liste3 = {
          _id: liste._id,
          titre: liste.titre,
          taches: liste.taches,
        }
        this.tacheService.updateListes(liste3).subscribe({
          next: (data2: listeDB) => { }
        });
      }
    });
    //vider le champ
    this.newTache[index].titre = '';
  }





  supprimer(tache: Tache): void {
    this.tacheService.removeTaches(tache).subscribe({
      next: (data) => {
        this.liste2.forEach(liste => {
          liste.tachesliste = liste.tachesliste.filter(t => t._id != tache._id);
          liste.taches = liste.taches.filter(t => t != tache._id);

          this.tacheService.updateListes(liste).subscribe({
            next: (data2: liste) => {
              this.tacheService.getListes().subscribe({
                next: (data3: Array<liste>) => { this.liste2 = data3; }
              });
            }
          });
        }
        );
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


  change(filter: string) {
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
      this.liste2.forEach(liste => {

        if (liste._id == event.container.id) {
          tache.statut = liste.titre;
          this.tacheService.updateTaches(tache).subscribe({
            next: (data) => {
            }
          });
          if (tache._id) {
            liste.taches.push(tache._id);
          }
          this.tacheService.updateListes(liste).subscribe({
            next: (data2: liste) => {
              //actualiser la liste
              this.tacheService.getListes().subscribe({
                next: (data3: Array<liste>) => { this.liste2 = data3; }
              });
            }
          });
        }
        if (liste._id == event.previousContainer.id) {
          liste.tachesliste = liste.tachesliste.filter(t => t._id != tache._id);
          liste.taches = liste.taches.filter(t => t != tache._id);
          this.tacheService.updateListes(liste).subscribe({
            next: (data2: liste) => {
              //actualiser la liste
              this.tacheService.getListes().subscribe({
                next: (data3: Array<liste>) => { this.liste2 = data3; }
              });
            }
          });
        }
      });
    }
  }


  ajoutliste() {
    this.newListe.titre = this.newListeAdd.titre;
    this.newListe.taches = [];
    this.tacheService.ajoutListes(this.newListe).subscribe({
      next: (data: listeDB) => {
        let id = data._id as string;
        this.newListeAdd._id = id;
        this.newListeAdd.taches = [];
        this.newListeAdd.tachesliste = [];
        this.liste2.push(this.newListeAdd);
        this.newListeAdd = {
          titre: '',
          taches: [],
          tachesliste: [],
        };
      }
    });
    //actualiser la liste
    this.tacheService.getListes().subscribe({
      next: (data3: Array<liste>) => { 
        console.log("test",data3);
        this.liste2 = data3; }
    });
      this.ngOnInit();
    console.log(this.liste2);
  }


  supprimerListe(liste: liste) {
    //supprime toutes les taches de la liste
    if(liste.tachesliste.length != 0){
      liste.tachesliste.forEach(tache => {
        this.tacheService.removeTaches(tache).subscribe({
          next: (data) => {
          }
        });
      });
    }
    //supprime la liste
    this.tacheService.removeListes(liste).subscribe({
      next: (data) => {
        this.liste2 = this.liste2.filter(l => l._id != liste._id);
      }
    });
  }
}
