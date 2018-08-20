import { Actor } from '../models/actor.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';
import { Rent } from '../models/rent.model';



@Injectable({providedIn: 'root'})
export class RentService {
  private myMoviesUpdated = new Subject<{ mymovies: Rent[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getMyMoviesUpdateListener() {
    return this.myMoviesUpdated.asObservable();
  }

  rentMovie(movieId: string, duration: number) {
    this.http.post('http://localhost:3000/api/rents/rentmovie', { movieId: movieId, duration: duration }).subscribe(
      (rentData) => {
        console.log(rentData);
        this.router.navigate(['/mymovies']);
      }
    );
  }

  getMyMovies() {
    this.http.get<{message: string, mymovies: any}>('http://localhost:3000/api/rents/mymovies').pipe(
      map(mymoviedData => {
        console.log(mymoviedData);
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
        console.log(transformedMyMovieData.mymovies);
        this.myMoviesUpdated.next(
          {
            mymovies: transformedMyMovieData.mymovies
          }
        );
      }
    );
  }
}
