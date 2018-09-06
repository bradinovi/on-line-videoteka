import { Component, OnInit, OnDestroy } from '@angular/core';
import { GenreService } from '../../services/genres.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { Genre } from '../../models/genre.model';
import { MovieService } from '../../services/movie.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-searchpage',
  templateUrl: './searchpage.component.html',
  styleUrls: ['./searchpage.component.css']
})
export class SearchpageComponent implements OnInit, OnDestroy {

  yearNumbersField: Number[] = [];
  isSearch = false;
  searchText: string;
  selectedGenre: string;
  selectedYear: string;
  selectedSort: string;
  genres: Genre[];

  genreSub: Subscription;

  constructor( private genreService: GenreService, public movieService: MovieService, private route: ActivatedRoute ) { }

  ngOnInit() {
    this.genreSub = this.genreService.getGenreUpdateListener().subscribe(
      (genreData) => {
        this.genres = genreData.genres;
      }
    );
    this.genreService.getGenres(0, 1);
   this.fillYearField();

   this.route.paramMap.subscribe((param: ParamMap) => {
    if (param.has('searchText')) {
      const parameter = param.get('searchText');
      this.isSearch = true;
      if (parameter.includes('genre')) {
        this.selectedGenre =  parameter.substring(5, parameter.length);
        this.movieService.getMovies( 5, 1, undefined, this.selectedGenre, this.selectedYear, this.selectedSort );
      } else {
        this.searchText = parameter;
        this.movieService.getMovies( 5, 1, param.get('searchText'), this.selectedGenre, this.selectedYear, this.selectedSort );
      }
    }});

  }

  fillYearField() {
    for (let i = (new Date()).getFullYear(); i > 1877 ; i--) {
      this.yearNumbersField.push(i);
    }
  }

  onSearch() {
    this.isSearch = true;
    this.movieService.getMovies( 5, 1, this.searchText, this.selectedGenre, this.selectedYear, this.selectedSort );

  }

  ngOnDestroy() {
    this.genreSub.unsubscribe();
  }

  onHitEnter(event) {
    if (event.key === 'Enter') {
      this.isSearch = true;
      this.movieService.getMovies( 5, 1, this.searchText, this.selectedGenre, this.selectedYear, this.selectedSort );
    }
  }

  clearSearch() {
    this.searchText = undefined;
  }

}
