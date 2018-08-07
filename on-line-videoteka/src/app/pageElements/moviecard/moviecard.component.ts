import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-moviecard',
  templateUrl: './moviecard.component.html',
  styleUrls: ['./moviecard.component.css']

})
export class MoviecardComponent implements OnInit {
  @Input() movie: Movie;


  movieTitle = '';
  movieYear = '';
  movieGenres = '';
  moviePrice = '';
  moviePosterPath = '';

  constructor() {


  }
  ngOnInit() {
    console.log(this.movie);
    this.movieYear = this.movie.movieYear.toString();
    this.movieTitle = this.movie.movieTitle + '(' + this.movie.movieYear.toString() + ')';
    this.moviePosterPath = this.movie.moviePosterPath;
    this.movieGenres = this.movie.movieGenre;
    this.moviePrice = this.movie.moviePrice.toString();
  }

}
