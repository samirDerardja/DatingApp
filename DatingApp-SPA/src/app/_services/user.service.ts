import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  getUsers(page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {

    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams(); 

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
   
    return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          console.log(response)

          console.log(response.headers)
          return paginatedResult;

        })
      );
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