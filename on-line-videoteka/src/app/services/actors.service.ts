import { Actor, ActorForAPI } from '../models/actor.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({providedIn: 'root'})
export class ActorService {
  private actors: Actor[] = [];

  private actorsUpdated = new Subject<{actors: Actor[], actorCount: number}>();


  constructor(private http: HttpClient, private router: Router) {}

  getActorUpdateListener() {
    return this.actorsUpdated.asObservable();
  }

  addActor(
    firstName: string, lastName: string,
    born:  string, died: string, ocupations: string[],
    bio: string,
    portrait: File) {

    const postData = new FormData();
    postData.append('firstName', firstName);
    postData.append('lastName', lastName);
    postData.append('born', born);
    postData.append('died', died);
    const ocupationsJSON = { ocupations: ocupations };
    postData.append('ocupations', JSON.stringify(ocupationsJSON));
    postData.append('bio', bio);
    postData.append('image', portrait, firstName + lastName);

    this.http.post<{message: string, actor: Actor}>('http://localhost:3000/api/actors', postData).subscribe((responseData) => {
      console.log(responseData.message);
      console.log(responseData.actor);
      this.router.navigate(['admin/actors']);
    });
  }

  getActors( actorsPerPage: number, currentPage: number ) {
    const queryParams = `?pagesize=${actorsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, actors: any, maxActors: number}>( 'http://localhost:3000/api/actors' + queryParams)
    .pipe( map((actorData) => {  // converts atribute name _id to id
      return {
        actors:
        actorData.actors.map( actor => {
        return {
          id: actor._id,
          firstName: actor.firstName,
          lastName: actor.lastName,
          born:  new Date(actor.born),
          died: new  Date(actor.died),
          ocupations: actor.ocupations,
          bio: actor.bio,
          portraitPath: actor.portraitPath,
          roles: actor.roles,
          directed: actor.directed
        }; }),
        maxPosts: actorData.maxActors
      };
    }) )
    .subscribe((transformedActorData) => {
      this.actors = transformedActorData.actors;
      this.actorsUpdated.next({
        actors : [...this.actors],
        actorCount: transformedActorData.maxPosts
      });
    });
  }

  getActor(actorId: string) {
    return this.http.get<
      {
        _id: string,
        firstName: string,
        lastName: string,
        born: Date,
        died: Date,
        ocupations: string[],
        bio: string,
        portraitPath: string,
        roles: string[],
        directed: string[]
      }
    >('http://localhost:3000/api/actors' + '/' + actorId);
  }

  updateActor(
      actorId: string,
      firstName: string,
      lastName: string,
      born:  string,
      died: string,
      ocupations: string[],
      bio: string,
      portrait: File| string, roles: string[], directed: string[]) {
      let actorData: ActorForAPI| FormData;
      console.log(portrait);
      console.log('typeof: ' + typeof(portrait));
      const ocupationsJSON = { ocupations: ocupations };
      if (typeof(portrait) === 'object') {
        console.log('SLIKA stavljena');
        actorData = new FormData();
        actorData.append('id', actorId);
        actorData.append('firstName', firstName);
        actorData.append('lastName', lastName);
        actorData.append('born', born);
        actorData.append('died', died);

        actorData.append('ocupations', JSON.stringify(ocupationsJSON));
        actorData.append('bio', bio);
        actorData.append('image', portrait, firstName + lastName);
      } else {
        actorData = {
          id: actorId,
          firstName: firstName,
          lastName: lastName,
          ocupations: ocupationsJSON,
          born: born,
          died: died,
          bio: bio,
          portraitPath: portrait,
          roles: roles,
          directed: directed
        };
      }
      console.log('----ACTOR DATA ----');
      console.log(actorData);
      this.http.put('http://localhost:3000/api/actors', actorData).subscribe((response) => {
        this.router.navigate(['admin/actors']);
      });
  }

  deleteActor(actorId: string) {
    return this.http.delete('http://localhost:3000/api/actors' + '/' + actorId);
  }
}
