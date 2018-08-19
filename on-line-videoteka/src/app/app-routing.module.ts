import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// my components imported
import { LoginComponent } from './userauth/login/login.component';
import { SignupComponent } from './userauth/signup/signup.component';
import { HomepageComponent } from './client/homepage/homepage.component';
import { SearchpageComponent } from './client/searchpage/searchpage.component';
import { MoviedetailComponent } from './client/moviedetail/moviedetail.component';
import { ActordetailComponent } from './client/actordetail/actordetail.component';
import { MyprofileComponent } from './client/myprofile/myprofile.component';
import { MymoviesComponent } from './client/mymovies/mymovies.component';

const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'searchpage', component: SearchpageComponent},
  { path: 'searchpage/:searchText', component: SearchpageComponent},
  { path: 'moviedetail/:movieId', component: MoviedetailComponent},
  { path: 'actordetail/:actorId', component: ActordetailComponent},
  { path: 'myprofile', component: MyprofileComponent},
  { path: 'mymovies', component: MymoviesComponent},
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
