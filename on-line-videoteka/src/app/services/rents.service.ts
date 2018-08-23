import { Actor } from '../models/actor.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';
import { Rent } from '../models/rent.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl;


@Injectable({providedIn: 'root'})
export class RentService {
  private myMoviesUpdated = new Subject<{ mymovies: Rent[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getMyMoviesUpdateListener() {
    return this.myMoviesUpdated.asObservable();
  }

  rentMovie(movieId: string, duration: number) {
    return this.http.post<any>(API_URL + 'rents/rentmovie', { movieId: movieId, duration: duration });
  }

  getMyMovies() {
    this.http.get<{message: string, mymovies: any}>(API_URL + 'rents/mymovies').pipe(
      map(mymoviedData => {
        return {
          mymovies: mymoviedData.mymovies.map( mymovie => {
            return {
            id: mymovie._id,
            user: mymovie.user,
            rentDay: mymovie.rentDay,
            movie:  {
                  id: mymovie.movie._id,
                  title: mymovie.movie.title,
                  release: mymovie.movie.release,
                  duration: mymovie.movie.duration,
                  trailerLink: mymovie.movie.trailerLink,
                  plotsum: mymovie.movie.plotsum,
                  genres: null,
                  posterPath: mymovie.movie.posterPath,
                  rents: mymovie.movie.rents
                },

            duration: mymovie.duration
          };
        })};
      }
      )
    ).subscribe(
      transformedMyMovieData => {
        // console.log(transformedMyMovieData.mymovies);
        this.myMoviesUpdated.next(
          {
            mymovies: transformedMyMovieData.mymovies
          }
        );
      }
    );
  }

  extendRent(rentId: string, duration: number) {
    return this.http.patch<any>(API_URL + 'rents/extendrent', { rentId: rentId, duration: duration });
  }

}
