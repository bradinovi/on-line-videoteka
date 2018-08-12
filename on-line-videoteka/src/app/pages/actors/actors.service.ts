import { Actor } from '../../models/actor.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class ActorService {
  private actors: Actor[] = [];

  private actorsUpdated = new Subject<{posts: Actor[], actorCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

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
    postData.append('ocupations', JSON.stringify(ocupations));
    postData.append('bio', bio);
    postData.append('image', portrait, firstName + lastName);

    this.http.post<{message: string, actor: Actor}>('http://localhost:3000/api/actors', postData).subscribe((responseData) => {
      console.log(responseData.message);
      console.log(responseData.actor);
    });
  }

}
