import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // @Input() valuesFromHome: any;
  // faire communiquer l enfants avec le parent  ex: click d un boutton via emmetteur d evenement
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(() => {
      this.alertify.success('registration successfully');
    }, error => {
      this.alertify.error('user all ready exist');
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }


}
