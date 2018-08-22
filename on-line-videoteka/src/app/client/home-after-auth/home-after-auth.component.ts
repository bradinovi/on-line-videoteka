import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-home-after-auth',
  templateUrl: './home-after-auth.component.html',
  styleUrls: ['./home-after-auth.component.css']
})
export class HomeAfterAuthComponent implements OnInit {
  recentMovies: Movie[];
  topMoviesMonth: Movie[];
  isLoadingRecent =  true;
  isLoadingTop = true;
  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getRecentMovies(5).subscribe(
      data => {
        this.recentMovies = data.movies;
        this.isLoadingRecent = false;

      }
    );

    this.movieService.getTopMonthlyMovies(5).subscribe(
      data => {
        this.topMoviesMonth = data.topmonth;
        this.isLoadingTop = false;

      }
    );
  }

}
