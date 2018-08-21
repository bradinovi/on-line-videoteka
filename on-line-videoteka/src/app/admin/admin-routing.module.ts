import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActorAddComponent } from './actor-add/actor-add.component';
import { MovieAddComponent } from './movie-add/movie-add.component';
import { ActorListComponent } from './actor-list/actor-list.component';
import { GenreCrudComponent } from './genre-crud/genre-crud.component';
import { UserCrudComponent } from './user-crud/user-crud.component';
import { AdminAuthGuard } from './admin-auth.guard';
import { RentsCrudComponent } from './rents-crud/rents-crud.component';




const routes: Routes = [
  { path: 'actoradd/:id', component: ActorAddComponent, canActivate: [AdminAuthGuard] },
  { path: 'actoradd', component: ActorAddComponent, canActivate: [AdminAuthGuard] },
  { path: 'movieadd', component: MovieAddComponent, canActivate: [AdminAuthGuard] },
  { path: 'movieadd/:id', component: MovieAddComponent, canActivate: [AdminAuthGuard] },
  { path: 'actors', component: ActorListComponent, canActivate: [AdminAuthGuard] },
  { path: 'genres', component: GenreCrudComponent, canActivate: [AdminAuthGuard] },
  { path: 'users', component: UserCrudComponent, canActivate: [AdminAuthGuard] },
  { path: 'rents', component: RentsCrudComponent, canActivate: [AdminAuthGuard] }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [AdminAuthGuard]

})
export class AdminRoutingModule {

}
