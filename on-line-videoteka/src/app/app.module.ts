import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// imported after project creation

// my modules
import { AngularMaterialModule } from './angular-material.module';

import { LoginComponent } from './userauth/login/login.component';
import { SignupComponent } from './userauth/signup/signup.component';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { ReactiveFormsModule} from '@angular/forms';




import { NavbarComponent } from './navbar/navbar.component';

import { AdminModule } from './admin/admin.module';

import { MoviecardComponent } from './client/moviecard/moviecard.component';
import { MoviecardgridComponent } from './client/moviecardgrid/moviecardgrid.component';
import { MyprofileComponent } from './client/myprofile/myprofile.component';
import { MymoviesComponent } from './client/mymovies/mymovies.component';
import { SearchpageComponent } from './client/searchpage/searchpage.component';
import { MoviedetailComponent } from './client/moviedetail/moviedetail.component';
import { ActordetailComponent} from './client/actordetail/actordetail.component';
import { HomepageComponent } from './client/homepage/homepage.component';
import { FullBioComponent } from './client/actordetail/full-bio/full-bio.component';
import { MovieDeleteDialogComponent } from './client/moviedetail/movie-delete-dialog/movie-delete-dialog.component';
import { RentDialogComponent } from './client/rent-dialog/rent-dialog.component';
import { AuthInterceptor } from './userauth/auth-intercept';



export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.gggg'
  },
  display: {
    dateInput: 'DD.MM.gggg',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD.MM.gggg',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    MoviecardComponent,
    MoviecardgridComponent,
    MyprofileComponent,
    MymoviesComponent,
    SearchpageComponent,
    MoviedetailComponent,
    ActordetailComponent,
    HomepageComponent,
    FullBioComponent,
    MovieDeleteDialogComponent,
    RentDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [FullBioComponent, MovieDeleteDialogComponent, RentDialogComponent]
})
export class AppModule { }
