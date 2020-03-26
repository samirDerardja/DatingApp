import { Injectable } from '@angular/core';
import { User} from '../_models/user';
import {Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()

export class MemberListResolver implements Resolve<User[]> {


    listUsers : User;
    pageNumber = 1;
    pageSize = this.listUsers;

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {

        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(

            catchError(error => {
                this.alertify.error('Problème de récupération des données');
                this.router.navigate(['/home']);
                console.log(this.pageSize);
                return of(null);
            })
            
        );
    }
}





