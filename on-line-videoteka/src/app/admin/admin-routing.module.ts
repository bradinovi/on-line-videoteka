import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActorAddComponent } from './actor-add/actor-add.component';
import { MovieAddComponent } from './movie-add/movie-add.component';




const routes: Routes = [
  { path: 'actoradd', component: ActorAddComponent },
  { path: 'movieadd', component: MovieAddComponent }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],

})
export class AdminRoutingModule {

}
