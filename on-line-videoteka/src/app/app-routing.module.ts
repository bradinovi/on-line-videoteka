import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// my components imported
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SearchpageComponent } from './pages/searchpage/searchpage.component';
import { MoviedetailComponent } from './pages/moviedetail/moviedetail.component';
import { ActordetailComponent } from './pages/actordetail/actordetail.component';
import { MyprofileComponent } from './pages/myprofile/myprofile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'searchpage', component: SearchpageComponent},
  { path: '', component: HomepageComponent},
  { path: 'moviedetail', component: MoviedetailComponent},
  { path: 'actordetail', component: ActordetailComponent},
  { path: 'myprofile', component: MyprofileComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
