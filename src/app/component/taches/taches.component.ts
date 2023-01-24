import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tache } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';
import { UserService } from 'src/app/service/user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { liste, listeDB } from 'src/app/model/list';
import { User } from 'src/app/model/user';
import { lastValueFrom } from 'rxjs';



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
  user : User = {
    login: '',
    password: '',
    listesId : [],
  };



  filter: string = 'Tous';


  constructor(private tacheService: TachesService,
    private userService: UserService,
    private router: Router) { }

    async ngOnInit() {
      try {
        const data = await lastValueFrom(this.userService.getUserInfos());
        if (data)
          this.user = data;
          console.log(this.user);
        const data2 = await lastValueFrom(this.tacheService.getListes(this.user));
        if (data2)
          this.liste2 = data2;
        this.liste2.forEach(liste => {
          this.newTache.push({
            titre: '',
            termine: false,
            statut: liste.titre
          });
        });
      } catch (error) {
  
        this.router.navigate(['login']);
      }
    }
    
  ajouter(liste: liste) {
    let index = this.liste2.indexOf(liste);
    if (liste.tachesliste == undefined) {
      liste.tachesliste = [];
    }
    this.newTache[index].statut = liste.titre;
    if(this.newTache[index].titre == ''){
      return;
    }
    this.tacheService.ajoutTaches(this.newTache[index]).subscribe({
      next: (data: Tache) => {
        let id = data._id as string;
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
              this.tacheService.getListes(this.user).subscribe({
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
    });
    this.user = {
      login: '',
      password: '',
      listesId: []
    };
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
              this.tacheService.getListes(this.user).subscribe({
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
              this.tacheService.getListes(this.user).subscribe({
                next: (data3: Array<liste>) => { this.liste2 = data3; }
              });
            }
          });
        }
      });
    }
  }

  ajoutliste() {
    if(this.user.listesId == undefined){
      this.user.listesId = [];
    }
    this.newListe.titre = this.newListeAdd.titre;
    this.newListe.taches = this.newListeAdd.taches;
    if (this.newListe.titre == '') {
      return;
    }
    this.tacheService.ajoutListes(this.newListe).subscribe({
      next: (data) => {
        if(data._id){
          this.user.listesId.push(data._id);
        }
        this.userService.updateUser(this.user).subscribe({
          next: (data2) => {
            this.tacheService.getListes(this.user).subscribe({
              next: (data3: Array<liste>) => { this.liste2 = data3;
              }
            });
          }
        });
        this.newTache.push({
          titre: '',
          termine: false,
          statut: data.titre
        });
      }
    });
    this.newListe = {
      titre: '',
      taches: [],
    };
    this.newListeAdd = {
      titre: '',
      taches: [],
      tachesliste: []
    };
    this.newTache.push({
      titre: '',
      termine: false,
      statut: ''
    });
  }

  supprimerListe(liste: liste) {
    //supprimer les taches de la liste 
    if(liste.tachesliste.length != 0){
      liste.tachesliste.forEach(tache => {
        this.tacheService.removeTaches(tache).subscribe({
          next: (data) => {
          }
        });
      });
    }
    //supprimer la liste
    this.tacheService.removeListes(liste).subscribe({
      next: (data) => {
        this.user.listesId = this.user.listesId.filter(l => l != liste._id);
        this.userService.updateUser(this.user).subscribe({
          next: (data2) => {
            this.tacheService.getListes(this.user).subscribe({
              next: (data3: Array<liste>) => { this.liste2 = data3; }
            });
          }
        });
      }
    });
  }
}
