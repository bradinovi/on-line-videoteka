import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// imported after project creation

// my modules
import { AngularMaterialModule } from './angular-material.module';
import { NavbarComponent } from './pageElements/navbar/navbar.component';
import { LoginComponent } from './userauth/login/login.component';
import { SignupComponent } from './userauth/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MoviecardComponent } from './pageElements/moviecard/moviecard.component';
import { MoviecardgridComponent } from './pageElements/moviecardgrid/moviecardgrid.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchpageComponent } from './pages/searchpage/searchpage.component';
import { MoviedetailComponent } from './pages/movies/moviedetail/moviedetail.component';
import { ActordetailComponent, DialogOverviewExampleDialog  } from './pages/actors/actordetail/actordetail.component';
import { MyprofileComponent } from './pages/myprofile/myprofile.component';
import { MymoviesComponent } from './pages/mymovies/mymovies.component';
import { ActorAddComponent } from './pages/actors/actor-add/actor-add.component';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { MovieAddComponent } from './pages/movies/movie-add/movie-add.component';

import { ReactiveFormsModule} from '@angular/forms';


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
    HomepageComponent,
    MoviecardComponent,
    MoviecardgridComponent,
    SearchpageComponent,
    MoviedetailComponent,
    ActordetailComponent,
    DialogOverviewExampleDialog,
    MyprofileComponent,
    MymoviesComponent,
    ActorAddComponent,
    MovieAddComponent
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
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog]
})
export class AppModule { }
