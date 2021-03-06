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
import { AuthGuard } from './userauth/userauth.guard';
import { HomeAfterAuthComponent } from './client/home-after-auth/home-after-auth.component';


const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'searchpage', component: SearchpageComponent, canActivate: [AuthGuard]},
  { path: 'searchpage/:searchText', component: SearchpageComponent, canActivate: [AuthGuard]},
  { path: 'moviedetail/:movieId', component: MoviedetailComponent, canActivate: [AuthGuard]},
  { path: 'actordetail/:actorId', component: ActordetailComponent, canActivate: [AuthGuard]},
  { path: 'myprofile', component: MyprofileComponent, canActivate: [AuthGuard]},
  { path: 'mymovies', component: MymoviesComponent, canActivate: [AuthGuard]},
  { path: 'userhome', component: HomeAfterAuthComponent, canActivate: [AuthGuard]},
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {

}
