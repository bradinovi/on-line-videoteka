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
        this.recentMovies = data.movies.map( movie => {
          return {
            id: movie._id,
            title: movie.title,
            release: movie.release,
            duration: movie.duration,
            trailerLink: movie.trailerLink,
            plotsum: movie.plotSum,
            genres: movie.genres,
            posterPath: movie.posterPath,
            rents: movie.rents
          };
        });
        this.isLoadingRecent = false;

      }
    );

    this.movieService.getTopMonthlyMovies(5).subscribe(
      data => {
        this.topMoviesMonth = data.topmonth.map( movie => {
          return {
            id: movie._id,
            title: movie.title,
            release: movie.release,
            duration: movie.duration,
            trailerLink: movie.trailerLink,
            plotsum: movie.plotSum,
            genres: movie.genres,
            posterPath: movie.posterPath,
            rents: movie.rents
          };
        });;
        this.isLoadingTop = false;

      }
    );
  }

}
