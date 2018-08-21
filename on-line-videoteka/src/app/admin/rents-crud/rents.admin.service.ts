
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Rent } from '../../models/rent.model';




@Injectable({providedIn: 'root'})
export class RentAdminService {
  private rentsUpdated = new Subject<{ rents: Rent[], count: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getRentsUpdateListener() {
    return this.rentsUpdated.asObservable();
  }

  rentMovie(userId: string, movieId: string, duration: number, rentDay: string) {
    return this.http.post<any>('http://localhost:3000/api/rents',
    { userId: userId, movieId: movieId, duration: duration, rentDay: rentDay });
  }

  updateRent(rentId: string, userId: string, movieId: string, duration: number, rentDay: string) {
    return this.http.put<any>('http://localhost:3000/api/rents',
    { rentId: rentId, userId: userId, movieId, duration: duration, rentDay: rentDay });
  }

  getRents(rentsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${rentsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, rents: any, maxRents: number}>('http://localhost:3000/api/rents' + queryParams).pipe(
      map(mymoviedData => {
        return {
          rents: mymoviedData.rents.map( mymovie => {
            return {
            id: mymovie._id,
            user: {
               id: mymovie.user._id,
               firstName : mymovie.user.firstName,
               lastName : mymovie.user.lastName,
               username : mymovie.user.username
            },
            rentDay: mymovie.rentDay,
            movie:  {
                  id: mymovie.movie._id,
                  title: mymovie.movie.title,
                  release: null,
                  duration: null,
                  trailerLink: null,
                  plotsum: null,
                  genres: null,
                  posterPath: mymovie.movie.posterPath,
                  rents: null
                },
            duration: mymovie.duration
          };
        }),
        maxRents: mymoviedData.maxRents
      };
      }
      )
    ).subscribe(
      transformedMyMovieData => {
        console.log(transformedMyMovieData.rents);
        this.rentsUpdated.next(
          {
            rents: transformedMyMovieData.rents,
            count: transformedMyMovieData.maxRents
          }
        );
      }
    );
  }

  deleteRent(rentId: string) {
    return this.http.delete<any>('http://localhost:3000/api/rents' + '/' + rentId);
  }

}
