import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActorAddComponent } from './actor-add/actor-add.component';
import { MovieAddComponent } from './movie-add/movie-add.component';
import { ActorListComponent } from './actor-list/actor-list.component';
import { GenreCrudComponent } from './genre-crud/genre-crud.component';
import { UserCrudComponent } from './user-crud/user-crud.component';




const routes: Routes = [
  { path: 'actoradd/:id', component: ActorAddComponent },
  { path: 'actoradd', component: ActorAddComponent },
  { path: 'movieadd', component: MovieAddComponent },
  { path: 'movieadd/:id', component: MovieAddComponent },
  { path: 'actors', component: ActorListComponent },
  { path: 'genres', component: GenreCrudComponent },
  { path: 'users', component: UserCrudComponent }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],

})
export class AdminRoutingModule {

}
