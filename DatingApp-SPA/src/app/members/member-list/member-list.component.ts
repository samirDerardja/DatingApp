import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '../../_models/pagination';


@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  users: User[];
  // pagination: Pagination;
  pagination: Pagination;

  p = 1;
  collection: any = [];

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
  
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      // tslint:disable-next-line: no-unused-expression
      this.pagination = data['users'].pagination;
    })

   this.collection = this.users;
   console.log(this.collection);
  }


  // loadUsers() {
  //   this.userService.getUsers().subscribe(
  //     (users: User[]) => {
  //       this.users = users;
  //     },
  //     error => {
  //       this.alertify.error(error);
  //     }
  //   );
  // }
}
