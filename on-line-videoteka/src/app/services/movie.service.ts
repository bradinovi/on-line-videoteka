import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from '../../../node_modules/rxjs/operators';
import { Movie, MovieForAPI } from '../models/movie.model';
import { Genre } from '../models/genre.model';

export interface Director {
  id: string;
  firstName: string;
  lastName: string;
  portraitPath: string;
}

@Injectable({providedIn: 'root'})
export class MovieService {
  private movies: Movie[] = [];
  private directors: Director[] = [];
  private moviesUpdated = new Subject<{movies: Movie[], movieCount: number}>();
  private directorsUpdated = new Subject<{directors: Director[], movieId: string}>();
  private searchQueryUpdated = new Subject<
    {
      searchText: string, selectedGenre: string, selectedYear: string, selectedSort: string
    }
  >();

  constructor(private http: HttpClient, private router: Router) {}

  getMovieUpdateListener() {
    return this.moviesUpdated.asObservable();
  }

  getDirectorsUpdateListener() {
    return this.directorsUpdated.asObservable();
  }

  getSearchQueryUpdatedListener() {
    return this.searchQueryUpdated.asObservable();
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

  updateQueryData(searchText: string,
    selectedGenre: string, selectedYear: string, selectedSort: string) {
    this.searchQueryUpdated.next({
      searchText: searchText, selectedGenre: selectedGenre, selectedYear: selectedYear, selectedSort: selectedSort
    });
  }

  getMovies( genresPerPage: number, currentPage: number, searchText: string,
    selectedGenre: string, selectedYear: string, selectedSort: string ) {
    const queryParams = `?pagesize=${genresPerPage}&page=${currentPage}`;
    const searchParams =
    `&searchText=${searchText}&selectedGenre=${selectedGenre}&selectedYear=${selectedYear}&selectedSort=${selectedSort}`;

    console.log(searchParams + queryParams);
    this.http.get<{message: string, movies: any, maxPosts: number}>( 'http://localhost:3000/api/movies' + queryParams + searchParams)
    .pipe( map((movieData) => {
      return {
        movies:
        movieData.movies.map( movie => {
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
        }; }),
        maxGenres: movieData.maxPosts
      };
    }) )
    .subscribe((transformedMovieData) => {
      this.movies = transformedMovieData.movies;
      this.moviesUpdated.next({
        movies : [...this.movies],
        movieCount: transformedMovieData.maxGenres
      });
      this.searchQueryUpdated.next({
        searchText: searchText, selectedGenre: selectedGenre, selectedYear: selectedYear, selectedSort: selectedSort
      });
    });
  }

  getMovie(movieId: string) { // ???
    return this.http.get <{
      genres: { _id: string, name: string, __v: number }[],
      roles: {}[],
      directors: {}[],
      _id: string,
      title: string,
      duration: number,
      release: string,
      trailerLink: string,
      plotsum: string,
      posterPath: string,
      rents: number

    }>('http://localhost:3000/api/movies' + '/' + movieId);
  }



  updateMovie( movieId: string, title: string, release: string, duration: number,
    trailerLink: string, plotSum: string, genres: Genre[], image: File | string, rents: number) {
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
      movieData.append('rents', rents.toString());
    } else {
    movieData = {
      id: movieId,
      title: title,
      release: release,
      duration: duration,
      trailerLink: trailerLink,
      plotsum: plotSum,
      genres: {genres: genresForSend},
      posterPath: image,
      rents: rents
    };
  }
    return this.http.put('http://localhost:3000/api/movies', movieData);
  }

  deleteMovie(movieId: string) {
    return this.http.delete('http://localhost:3000/api/movies' + '/' + movieId);
  }

  addDirector(movieId: string, directorId: string) {
    return this.http.post('http://localhost:3000/api/movies/director' + '/' + movieId, { actorId: directorId });
  }

  deleteDirector(movieId: string, directorId: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: { actorId: directorId }
  };
    return this.http.delete('http://localhost:3000/api/movies/director' + '/' + movieId, httpOptions);
  }



  getMovieDirectors(movieId: string) {
    this.http.get<
    { directors: { directors: any, _id: string, title: string } }
    >('http://localhost:3000/api/movies/director' + '/' + movieId).pipe(
      map(directorData => {
        return {
          movieId: directorData.directors._id,
          directors: directorData.directors.directors.map(
            (director => {
              return {
                id: director._id,
                firstName: director.firstName,
                lastName: director.lastName,
                portraitPath: director.portraitPath
              };
            })
          )
        };
      })
    ).subscribe(
      (transformedDirectorData) => {
        this.directors = transformedDirectorData.directors;
        this.directorsUpdated.next({
          directors: [...this.directors],
          movieId: transformedDirectorData.movieId
        });
      }
    );
  }
}
