import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// imported after project creation

// my modules
import { AngularMaterialModule } from './angular-material.module';
import { NavbarComponent } from './pageElements/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { FormsModule } from '../../node_modules/@angular/forms';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MoviecardComponent } from './pageElements/moviecard/moviecard.component';
import { MoviecardgridComponent } from './pageElements/moviecardgrid/moviecardgrid.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchpageComponent } from './pages/searchpage/searchpage.component';
import { MoviedetailComponent } from './pages/moviedetail/moviedetail.component';
import { ActordetailComponent, DialogOverviewExampleDialog  } from './pages/actordetail/actordetail.component';
import { MyprofileComponent } from './pages/myprofile/myprofile.component';

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
    MyprofileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule


  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog]
})
export class AppModule { }
