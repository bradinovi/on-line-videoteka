import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { RentDialogComponent } from '../rent-dialog/rent-dialog.component';
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
  @Input() daysLeft: string;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // console.log(this.movie);
    this.movieYear = moment(this.movie.release).format('Y');
  }

  onRent() {
    const data = {
      movieId: this.movie.id,
      posterPath: this.movie.posterPath,
      title: this.movie.title
    };
    this.dialog.open(RentDialogComponent, { data: data, maxWidth: '30%'});
  }

}
