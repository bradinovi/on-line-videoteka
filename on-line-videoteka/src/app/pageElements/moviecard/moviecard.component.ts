import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-moviecard',
  templateUrl: './moviecard.component.html',
  styleUrls: ['./moviecard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MoviecardComponent implements OnInit {

  movieTitle = '';
  movieGenres = '';
  moviePrice = '';
  moviePosterPath =
  'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SY1000_CR0,0,674,1000_AL_.jpg';

  constructor() {
    // test data
    this.movieTitle = 'Avengers: Infinity War' + '(' + '2018' + ')';
    this.movieGenres = 'Action, Adventure, Fantasy';
    this.moviePrice = '3';

  }
  ngOnInit() {
  }

}
