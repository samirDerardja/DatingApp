import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
   
    return this.http.get<User[]>(this.baseUrl + 'users');
  }

  getUser(id: number): Observable<User> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
   });
    return this.http.get<User>(this.baseUrl + 'users/' + id, {headers: reqHeader});
  }
  

  updateUser(id: number, user: User){
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token'))
   });
    return this.http.put(this.baseUrl + 'users/' + id, user, {headers: reqHeader});
}

setMainPhoto(userid: number, id: number){
  return this.http.post(this.baseUrl + 'users/' + userid + '/photos/' + id  + '/setMain', {});
}

deletePhoto(userid: number, id: number) {
  return this.http.delete(this.baseUrl + 'users/' + userid + '/photos/' + id);
}
}