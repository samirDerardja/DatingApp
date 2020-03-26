import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProivder } from './_services/error.interceptor';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { routes } from './route.routing';
import { RouterModule } from '@angular/router';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { AlertifyService } from './_services/alertify.service';
import { AuthGuard } from './_guards/auth.guard';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { OwlModule } from 'ngx-owl-carousel';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md';
import { FileUploadModule } from 'ng2-file-upload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeagoModule, TimeagoIntl, TimeagoClock } from 'ngx-timeago';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {NgxPaginationModule} from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent 
   ],
   imports: [
      BrowserModule,
      NgxPaginationModule,
      BsDatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      TimeagoModule.forRoot({
         intl: {provide: TimeagoIntl, useClass: MemberDetailComponent},
         clock: {provide: TimeagoClock, useClass: MemberDetailComponent},
       }),
      HttpClientModule,
      FormsModule,
      CarouselModule,
      BrowserAnimationsModule,
      WavesModule,
      FileUploadModule,
      ReactiveFormsModule,
      RouterModule.forRoot(routes),
      JwtModule.forRoot({
            config: {
               tokenGetter: tokenGetter,
               whitelistedDomains: ['localhost:5000'],
               blacklistedRoutes: ['localhost:5000/api/auth']
            }
       } ),
   ],

   // declaration des services, guard, helpers, resolver
   providers: [
      ErrorInterceptorProivder,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      AuthService,
      AlertifyService,
      AuthGuard,
      TimeagoIntl,
      PreventUnsavedChanges,
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
