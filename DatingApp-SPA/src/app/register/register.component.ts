import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { listLocales, defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { frLocale } from 'ngx-bootstrap/locale';
import { Router } from '@angular/router';
defineLocale('fr', frLocale);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // @Input() valuesFromHome: any;
  // faire communiquer l enfants avec le parent  ex: click d un boutton via emmetteur d evenement
  @Output() cancelRegister = new EventEmitter();
  registerForm : FormGroup;
  user : any = {};
  bsConfig : Partial<BsDatepickerConfig>;
  locale = 'fr';
  locales = listLocales();


  constructor(private authService: AuthService, private alertify: AlertifyService, 
    private fb: FormBuilder, private localeService : BsLocaleService, private router : Router) { }

  applyLocale(pop: any) {
    this.localeService.use(this.locale);
    pop.hide();
    pop.show();
  }

  ngOnInit() {
this.bsConfig = {
  containerClass: 'theme-red'
}
   this.createRegisterForm();
  }
  passwordMatchValidator(g: FormGroup) {
    /**
     * * compare le mot de passe avec celui pour la confirmation : si la valeur et strict égale : true, sinon ne correspond pas
     */
        return g.get('password').value === g.get('confirmPassword').value ? null : {'missmatch' : true};
  }

  register() {
    if( this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Inscription reussi');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        })
      })
    }
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender : ['homme'],
      username: ['', Validators.required],
      knownAs : ['', Validators.required],
      dateOfBirth : [null , Validators.required],
      city : ['', Validators.required],
      country : ['', Validators.required],
      password : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  // register() {
  //   // this.authService.register(this.model).subscribe(() => {
  //   //   this.alertify.success('registration successfully');
  //   // }, error => {
  //   //   this.alertify.error('user all ready exist');
  //   // });

  //   console.log(this.registerForm.value);
  // }

  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }


}
