import { Actor } from '../models/actor.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';
import { RoleOfMovie, RoleOfActor } from '../models/role.model';


@Injectable({providedIn: 'root'})
export class RoleService {
  private rolesOfMovie: RoleOfMovie[] = [];
  private rolesOfActor: RoleOfActor[] = [];
  private rolesOfMovieUpdated = new Subject<{roles: RoleOfMovie[], roleCount: number}>();
  private rolesOfActorUpdated = new Subject<{roles: RoleOfActor[], roleCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getrolesOfMovieUpdatedListener() {
    return this.rolesOfMovieUpdated.asObservable();
  }

  getrolesOfActorUpdatedListener() {
    return this.rolesOfActorUpdated.asObservable();
  }

  addRole(name: string, actorId: string, movieId: string) {
    const roleData = {
      movie: movieId,
      actor: actorId,
      name: name
   };
    return this.http.post<{message: string, genre: Actor}>('http://localhost:3000/api/roles', roleData);
  }

  getRolesForMovie(movieId: string) {
    this.http.get<{message: string, roles: any, maxRoles: number}>( 'http://localhost:3000/api/roles/movie/' + movieId)
    .pipe( map((roleData) => {
      return {
        roles:
        roleData.roles.map( role => {
        return {
          id: role._id,
          movie: role.movie,
          actor: role.actor,
          name: role.name
        }; }),
        maxRoles: roleData.maxRoles
      };
    }) )
    .subscribe((transformedRoleData) => {
      this.rolesOfMovie = transformedRoleData.roles;
      this.rolesOfMovieUpdated.next({
        roles : [...this.rolesOfMovie],
        roleCount: transformedRoleData.maxRoles
      });
    });
  }

  getRolesForActor(actorId: string) {
    this.http.get<{message: string, roles: any, maxRoles: number}>( 'http://localhost:3000/api/roles/actor/' + actorId)
    .pipe( map((roleData) => {
      return {
        roles:
        roleData.roles.map( role => {
        return {
          id: role._id,
          movie: role.movie,
          actor: role.actor,
          name: role.name
        }; }),
        maxRoles: roleData.maxRoles
      };
    }) )
    .subscribe((transformedRoleData) => {
      this.rolesOfActor = transformedRoleData.roles;
      this.rolesOfActorUpdated.next({
        roles : [...this.rolesOfActor],
        roleCount: transformedRoleData.maxRoles
      });
    });
  }
  updateRole( roleId: string, actorId: string, movieId: string, name: string) {
    const roleData = {
        id: roleId,
        movie: movieId,
        actor: actorId,
        name: name
     };
     console.log(roleData);
    return this.http.put('http://localhost:3000/api/roles', roleData);
  }

  deleteRole(roleId: string) {
    return this.http.delete('http://localhost:3000/api/roles' + '/' + roleId);
  }
}
