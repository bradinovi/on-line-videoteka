import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import * as moment from 'moment';
@Component({
  selector: 'app-moviecard',
  templateUrl: './moviecard.component.html',
  styleUrls: ['./moviecard.component.css']

})
export class MoviecardComponent implements OnInit {
  @Input() movie: Movie;
  movieYear: string;
  @Input() likeRent: boolean;
  @Input() myMovies: boolean;





  constructor() {


  }
  ngOnInit() {
    //console.log(this.movie);
    this.movieYear = moment(this.movie.release).format('Y');
  }

}
