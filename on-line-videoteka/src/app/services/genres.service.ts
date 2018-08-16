import { Actor } from '../models/actor.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';
import { Genre } from '../models/genre.model';


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
    return this.http.post<{message: string, genre: Actor}>('http://localhost:3000/api/genres', genreData);
  }

  getGenres( genresPerPage: number, currentPage: number ) {

    const queryParams = `?pagesize=${genresPerPage}&page=${currentPage}`;
    console.log(queryParams);
    this.http.get<{message: string, genres: any, maxGenres: number}>( 'http://localhost:3000/api/genres' + queryParams)
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
    >('http://localhost:3000/api/genres' + '/' + genreId);
  }

  updateGenre( genreId: string, name: string) {
    const genreData = {
        id: genreId,
        name: name
     };
     console.log(genreData);
    return this.http.put('http://localhost:3000/api/genres', genreData);
  }

  deleteGenre(genreId: string) {
    return this.http.delete('http://localhost:3000/api/genres' + '/' + genreId);
  }
}
