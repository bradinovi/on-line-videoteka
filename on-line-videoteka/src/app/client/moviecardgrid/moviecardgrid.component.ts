import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { PageEvent } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-moviecardgrid',
  templateUrl: './moviecardgrid.component.html',
  styleUrls: ['./moviecardgrid.component.css'],

})
export class MoviecardgridComponent implements OnInit {
  isLoading = true;
  isDataAvailable = false;
  moviesToDisplay: Movie[];
  movieCount: number;
  currentPage: number;
  movieSub: Subscription;
  querySub: Subscription;
  moviesPerPage: number;
  pageSizeOptions = [ 5, 10, 15, 20 ];
  searchQuery: {searchText: string, selectedGenre: string, selectedYear: string, selectedSort: string};

  constructor(private movieService: MovieService) {
    this.movieSub = this.movieService.getMovieUpdateListener().subscribe(
      (movieData) => {
        this.moviesToDisplay = movieData.movies;
        // console.log(movieData.movies);
        this.movieCount = movieData.movieCount;
        this.isLoading = false;
      }
    );

  }

  ngOnInit() {
    this.querySub = this.movieService.getSearchQueryUpdatedListener().subscribe(
      (searchQueryData) => {
        this.searchQuery = searchQueryData;
        console.log(this.searchQuery);
      }
    );

  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.moviesPerPage = pageData.pageSize;
    this.movieService.getMovies(
      this.moviesPerPage, this.currentPage, this.searchQuery.searchText,
      this.searchQuery.selectedGenre, this.searchQuery.selectedYear, this.searchQuery.selectedSort
    );
  }
}
