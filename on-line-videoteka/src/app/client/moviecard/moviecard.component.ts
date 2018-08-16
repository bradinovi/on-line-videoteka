import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-moviecard',
  templateUrl: './moviecard.component.html',
  styleUrls: ['./moviecard.component.css']

})
export class MoviecardComponent implements OnInit {
  @Input() movie: Movie;

  @Input() likeRent: boolean;
  @Input() myMovies: boolean;



  movieTitle = '';
  movieYear = '';
  movieGenres = '';
  moviePrice = '';
  moviePosterPath = '';

  constructor() {


  }
  ngOnInit() {
    console.log(this.movie);
    this.movieYear = this.movie.release.toString();
    this.movieTitle = this.movie.title + '(' + this.movie.release.toString() + ')';
    this.moviePosterPath = this.movie.posterPath;
    // this.movieGenres = this.movie.genres;
    // this.moviePrice = this.movie.moviePrice.toString();
  }

}
