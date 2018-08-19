import { Component, OnInit, OnDestroy } from '@angular/core';
import { GenreService } from '../../services/genres.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { Genre } from '../../models/genre.model';
import { MovieService } from '../../services/movie.service';

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

  constructor( private genreService: GenreService, public movieService: MovieService ) { }

  ngOnInit() {
    this.genreSub = this.genreService.getGenreUpdateListener().subscribe(
      (genreData) => {
        this.genres = genreData.genres;
      }
    );
    this.genreService.getGenres(0, 1);
   this.fillYearField();
  }

  fillYearField() {
    for (let i = (new Date()).getFullYear(); i > 1877 ; i--) {
      this.yearNumbersField.push(i);
    }
  }

  onSearch() {
    /*
    console.log(this.searchText);
    console.log(this.selectedGenre);
    console.log(this.selectedYear);
    console.log(this.selectedSort); */
    this.isSearch = true;
    this.movieService.getMovies( 5, 1, this.searchText, this.selectedGenre, this.selectedYear, this.selectedSort );

  }

  ngOnDestroy() {
    this.genreSub.unsubscribe();
  }

}
