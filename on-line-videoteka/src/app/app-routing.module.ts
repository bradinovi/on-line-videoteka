import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// my components imported
import { LoginComponent } from './userauth/login/login.component';
import { SignupComponent } from './userauth/signup/signup.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SearchpageComponent } from './pages/searchpage/searchpage.component';
import { MoviedetailComponent } from './pages/movies/moviedetail/moviedetail.component';
import { ActordetailComponent } from './pages/actors/actordetail/actordetail.component';
import { MyprofileComponent } from './pages/myprofile/myprofile.component';
import { MymoviesComponent } from './pages/mymovies/mymovies.component';
import { ActorAddComponent } from './pages/actors/actor-add/actor-add.component';
import { MovieAddComponent } from './pages/movies/movie-add/movie-add.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'searchpage', component: SearchpageComponent},
  { path: '', component: HomepageComponent},
  { path: 'moviedetail', component: MoviedetailComponent},
  { path: 'actordetail', component: ActordetailComponent},
  { path: 'myprofile', component: MyprofileComponent},
  { path: 'mymovies', component: MymoviesComponent},
  { path: 'actoradd', component: ActorAddComponent},
  { path: 'movieadd', component: MovieAddComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
