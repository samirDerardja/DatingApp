import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})

export class MemberDetailComponent implements OnInit {

  user: User;
  images = [];

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

 this.getImages();
 console.log(this.images)
   
  }
  
  loadUser() {
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
      (user: User) => {
        this.user = user;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  getImages(){
    for(let i = 0; i < this.user.photos.length; i++)
    {
    // tslint:disable-next-line: prefer-const
    this.images.push(this.user.photos[i].url);
    console.log(this.images)
    }
  }

}
