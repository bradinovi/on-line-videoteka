import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';
import { Movie, MovieForAPI } from '../models/movie.model';
import { Genre } from '../models/genre.model';


@Injectable({providedIn: 'root'})
export class MovieService {
  private movies: Movie[] = [];

  private moviesUpdated = new Subject<{movies: Movie[], movieCount: number}>();


  constructor(private http: HttpClient, private router: Router) {}

  getMovieUpdateListener() {
    return this.moviesUpdated.asObservable();
  }

  addMovie(title: string, release: string, duration: number, trailerLink: string, plotSum: string, genres: Genre[], image: File) {
    const genresForSend = [];
    genres.forEach(genre => {
      genresForSend.push(genre.id);
    });

    const movieData = new FormData();
    movieData.append('title', title);
    movieData.append('release', release);
    movieData.append('duration', duration.toString());
    movieData.append('trailerLink', trailerLink);
    movieData.append('plotsum', plotSum);
    movieData.append('genres', JSON.stringify({genres: genresForSend}));
    movieData.append('image', image , title);

    return this.http.post<{message: string, createdMovie: any}>('http://localhost:3000/api/movies', movieData);
  }

  getMovies( genresPerPage: number, currentPage: number ) {
    const queryParams = `?pagesize=${genresPerPage}&page=${currentPage}`;
    console.log(queryParams);
    this.http.get<{message: string, movies: any, maxGenres: number}>( 'http://localhost:3000/api/movies' + queryParams)
    .pipe( map((movieData) => {
      return {
        movies:
        movieData.movies.map( movie => {
        return {
          id: movie.id,
          title: movie.title,
          release: movie.release,
          duration: movie.duration,
          trailerLink: movie.trailerLink,
          plotsum: movie.plotSum,
          genres: {genres: movie.genresForSend},
          posterPath: movie.image
        }; }),
        maxGenres: movieData.maxGenres
      };
    }) )
    .subscribe((transformedMovieData) => {
      this.movies = transformedMovieData.movies;
      this.moviesUpdated.next({
        movies : [...this.movies],
        movieCount: transformedMovieData.maxGenres
      });
    });
  }

  getMovie(movieId: string) {
    return this.http.get<
      {
        _id: string,
        name: string
      }
    >('http://localhost:3000/api/movies' + '/' + movieId);
  }

  updateMovie( movieId: string, title: string, release: string, duration: number,
    trailerLink: string, plotSum: string, genres: Genre[], image: File | string) {
    let movieData: MovieForAPI | FormData;
    const genresForSend = [];
    genres.forEach(genre => {
      genresForSend.push(genre.id);
    });
    if (typeof(image) === 'object') {
      movieData = new FormData();
      movieData.append('id', movieId);
      movieData.append('title', title);
      movieData.append('release', release);
      movieData.append('duration', duration.toString());
      movieData.append('trailerLink', trailerLink);
      movieData.append('plotsum', plotSum);
      movieData.append('genres', JSON.stringify({genres: genresForSend}));
      movieData.append('image', image , title);
    } else {
    movieData = {
      id: movieId,
      title: title,
      release: release,
      duration: duration,
      trailerLink: trailerLink,
      plotsum: plotSum,
      genres: {genres: genresForSend},
      posterPath: image
    };
  }
    return this.http.put('http://localhost:3000/api/movies', movieData);
  }

  deleteMovie(movieId: string) {
    return this.http.delete('http://localhost:3000/api/movies' + '/' + movieId);
  }
}
