import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { TimeagoIntl, TimeagoClock } from 'ngx-timeago';
import {strings as englishStrings} from 'ngx-timeago/language-strings/fr';
import { Observable, interval, of } from 'rxjs';
import { expand, delay, skip } from 'rxjs/operators';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
   
})
 
export class MemberDetailComponent extends TimeagoClock implements OnInit {

  user: User;
  images = [];
  // date = Date.now() - 30000;
  live = true;

  constructor( 
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    intl: TimeagoIntl
  ) {
    super();
    intl.strings = englishStrings;
    intl.changes.next();
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

 this.getImages();
 console.log(this.images)
   
  }

  tick(then: number): Observable<number> {
    return of(0)
    .pipe(
      expand(() => {
        const now = Date.now();
        const seconds = Math.round(Math.abs(now - then) / 1000);

        const period = seconds < 60 ? 1000 : 1000 * 60;

        return of(period).pipe(delay(period));
      }),
      skip(1)
    );
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
