import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem } from '@ngx-gallery/core';
// import {
//   NgxGalleryOptions,
//   NgxGalleryImage,
//   NgxGalleryAnimation
// } from 'ngx-gallery';
// import { Observable } from 'rxjs';
// import { Photo } from 'src/app/_models/photo';
import { NguCarouselConfig } from '@ngu/carousel';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})

export class MemberDetailComponent implements OnInit {
 
  user: User;
  // galleryOptions: NgxGalleryOptions[];
  // galleryImages: NgxGalleryImage[];
  // images: GalleryItem[];
  imgags = [
    'assets/bg.jpg',
    'assets/car.png',
    'assets/canberra.jpg',
    'assets/holi.jpg'
  ];
  public carouselTileItems: Array<any> = [0, 1, 2, 3, 4, 5];
  public carouselTiles = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };
  public carouselTile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 3, lg: 3, all: 0 },
    slide: 3,
    speed: 250,
    point: {
      visible: true
    },
    load: 2,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      
    });
    this.carouselTileItems.forEach(el => {
      this.carouselTileLoad(el);
    });
    // this.galleryOptions = [
    //   {
    //     width: '500px',
    //     height: '500px',
    //     imagePercent: 100,
    //     thumbnailsColumns:  4,
    //     imageAnimation: NgxGalleryAnimation.Slide,
    //     preview: false
    //   }
    // ];
    // tslint:disable-next-line: no-unused-expression
    // this.galleryImages = this.getImages() ;
    // console.log(this.galleryImages);
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

  public carouselTileLoad(j) {
    // console.log(this.carouselTiles[j]);
    const len = this.carouselTiles[j].length;
    if (len <= 30) {
      for (let i = len; i < len + 15; i++) {
        this.carouselTiles[j].push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
    }
  }

  // getImages(){
  //   const imageUrls = [];
  //   for (const photoUnique of this.user.photo) {
  //     imageUrls.push({
  //       small: photoUnique.url,
  //       medium: photoUnique.url,
  //       big: photoUnique.url,
  //       description : photoUnique.description
  //      } );
  //   }
  //   if(imageUrls != null){
  //   return imageUrls;
  //   }
  // }

  // getImages() {
  //   const imageUrls = [];
  //   for (let i = 0; i < this.user.photo.length; i++) {
  //     imageUrls.push(this.user.photo[i].url);
  //   }
  //   return imageUrls;
  // }
}
