import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = 'http://localhost:3000/login';
  private urlUser: string = 'http://localhost:3000/userInfos/';

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

  getUserInfos(): Observable<User> {
    return this.http.get<User>(this.urlUser, { withCredentials: true });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.urlUser + user._id, user, { withCredentials: true });
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/register', user, { withCredentials: true });
  }

}