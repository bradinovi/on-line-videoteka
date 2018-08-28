import { Actor, ActorForAPI } from '../models/actor.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';
import { environment } from '../../environments/environment';

export interface Directed {
  id: string;
  title: string;
}

const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class ActorService {
  private actors: Actor[] = [];
  private directed: Directed[] = [];
  private actorsUpdated = new Subject<{actors: Actor[], actorCount: number}>();
  private directedUpdated = new Subject<{directed: Directed[], firstName: string}>();

  constructor(private http: HttpClient, private router: Router) {}

  getActorUpdateListener() {
    return this.actorsUpdated.asObservable();
  }

  getDirectedUpdatedListener() {
    return this.directedUpdated.asObservable();
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
    postData.append('ocupations', JSON.stringify( {ocupations: ocupations} ));
    postData.append('bio', bio);
    postData.append('image', portrait, firstName + lastName);

    this.http.post<{message: string, actor: Actor}>( API_URL + 'api/actors', postData).subscribe((responseData) => {
      this.router.navigate(['admin/actors']);
    });
  }

  getActors( actorsPerPage: number, currentPage: number, textSearch: string ) {
    const queryParams = `?pagesize=${actorsPerPage}&page=${currentPage}`;
    let textQuery = '';
    if (textSearch !== '') {
      textQuery = `&text=${textSearch}`;
    }
    this.http.get<{message: string, actors: any, maxActors: number}>( API_URL + 'actors' + queryParams + textQuery)
    .pipe( map((actorData) => {
        // converts atribute name _id to id
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
        maxActors: actorData.maxActors
      };
    }) )
    .subscribe((transformedActorData) => {
      this.actors = transformedActorData.actors;
      this.actorsUpdated.next({
        actors : [...this.actors],
        actorCount: transformedActorData.maxActors
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
    >(API_URL + 'actors' + '/' + actorId);
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
      const ocupationsJSON = { ocupations: ocupations };
      if (typeof(portrait) === 'object') {
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
      this.http.put(API_URL + 'actors', actorData).subscribe((response) => {
        this.router.navigate(['admin/actors']);
      });
  }

  deleteActor(actorId: string) {
    return this.http.delete(API_URL + 'actors' + '/' + actorId);
  }

  getActorDirected(actorId: string) {
    this.http.get<
    any>(API_URL + 'actors/directed' + '/' + actorId).pipe(
      map(directedData => {
        return {
          firstName: directedData.firstName,
          directed: directedData.directed.directed.map(
            (movie => {
              return {
                id: movie._id,
                title: movie.title
              };
            })
          )
        };
      })
    ).subscribe(
      (transformedDirectorData) => {
        this.directed = transformedDirectorData.directed;
        this.directedUpdated.next({
          directed: [...this.directed],
          firstName: transformedDirectorData.firstName
        });
      }
    );
  }
}
