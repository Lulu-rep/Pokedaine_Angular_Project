import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tache } from '../model/tache';

@Injectable({
  providedIn: 'root'
})
export class TachesService {
  private url:string = 'http://localhost:3000/taches/';

  constructor(private http: HttpClient) { }

  getTaches():Observable<Array<Tache>> {
    return this.http.get<Array<Tache>>(this.url, {withCredentials:true});
  }

  ajoutTaches(tache:Tache):Observable<Tache> {
    return this.http.post<Tache>(this.url,tache, {withCredentials:true});
  }

  updateTaches(tache:Tache):Observable<Tache> {
    return this.http.put<Tache>(this.url+tache._id, tache, {withCredentials:true});
  }

  removeTaches(tache:Tache):Observable<Tache> {
    return this.http.delete<Tache>(this.url+tache._id, {withCredentials:true});
  }
  
}
