import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { RentService } from '../../services/rents.service';
import * as moment from 'moment';

@Component({
  selector: 'app-mymovies',
  templateUrl: './mymovies.component.html',
  styleUrls: ['./mymovies.component.css']
})
export class MymoviesComponent implements OnInit, OnDestroy {

  isDataAvailable = false;
  moviesToDisplayAct: Movie[] = [];
  moviesToDisplayExp: Movie[] = [];

  myMovieSub: Subscription;

  constructor(private http: HttpClient, private rentService: RentService) {}
  ngOnInit() {
    const today = new Date();
    this.myMovieSub = this.rentService.getMyMoviesUpdateListener().subscribe(
      myMovieData => {
        const myMovies = myMovieData.mymovies;
        myMovies.forEach(movie => {
          const expireDate = new Date(movie.rentDay);
          expireDate.setDate(expireDate.getDate() + movie.duration);
          if ( expireDate > today) {
            movie.movie['rentDay'] = movie.rentDay;
            movie.movie['rentDuration'] = movie.duration;
            this.moviesToDisplayAct.push(movie.movie);
          } else {
            this.moviesToDisplayExp.push(movie.movie);
          }
        });
        this.isDataAvailable = true;
      }
    );
    this.rentService.getMyMovies();
  }

  getDaysLeft(movie) {
    const expireDate = new Date(movie.rentDay);
    expireDate.setDate(expireDate.getDate() + movie.rentDuration);
    const dt2 = expireDate;
    const dt1 = new Date();

    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
    Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) / (1000 * 60 * 60 * 24));
  }

  ngOnDestroy() {
    this.myMovieSub.unsubscribe();
  }
}
