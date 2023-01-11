import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  login(user: User): Observable<void>  {
    return this.http.post<void>(this.url, user, { withCredentials: true });
  }

  logout():Observable<void> {
    return this.http.post<void>('http://localhost:3000/logout', {}, { withCredentials: true });
  }
  
  isConnected(): Observable<void> {
    return this.http.get<void>('http://localhost:3000/isConnected', { withCredentials: true });
  }

}