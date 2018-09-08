import { Actor } from '../models/actor.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';
import { Genre } from '../models/genre.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class GenreService {
  private genres: Genre[] = [];

  private genresUpdated = new Subject<{genres: Genre[], genreCount: number}>();


  constructor(private http: HttpClient, private router: Router) {}

  getGenreUpdateListener() {
    return this.genresUpdated.asObservable();
  }

  addGenre(name: string) {
    const genreData = {
      name: name
    };
    return this.http.post<{message: string, genre: Actor}>(API_URL + 'genres', genreData);
  }

  getGenres( genresPerPage: number, currentPage: number ) {

    const queryParams = `?pagesize=${genresPerPage}&page=${currentPage}`;

    this.http.get<{message: string, genres: any, maxGenres: number}>( API_URL + 'genres' + queryParams)
    .pipe( map((genreData) => {
      return {
        genres:
        genreData.genres.map( actor => {
        return {
          id: actor._id,
          name: actor.name
        }; }),
        maxGenres: genreData.maxGenres
      };
    }) )
    .subscribe((transformedGenreData) => {
      this.genres = transformedGenreData.genres;
      this.genresUpdated.next({
        genres : [...this.genres],
        genreCount: transformedGenreData.maxGenres
      });
    });
  }

  getGenre(genreId: string) {
    return this.http.get<
      {
        _id: string,
        name: string
      }
    >(API_URL + 'genres' + '/' + genreId);
  }

  updateGenre( genreId: string, name: string) {
    const genreData = {
        id: genreId,
        name: name
     };
    return this.http.put(API_URL + 'genres', genreData);
  }

  deleteGenre(genreId: string) {
    return this.http.delete(API_URL + 'genres' + '/' + genreId);
  }
}
