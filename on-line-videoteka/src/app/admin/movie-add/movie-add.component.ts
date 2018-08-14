import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material';






export interface Genre {
  id: string;
  name: string;
}

@Component({
  selector: 'app-movie-add',
  templateUrl: './movie-add.component.html',
  styleUrls: ['./movie-add.component.css']
})
export class MovieAddComponent implements OnInit {
  roleDirectorFormsEnabled = true;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  genreControl = new FormControl();

  genres: Genre[] = [];
  movieGenres: Genre[] = [];
  filteredGenres: Observable<Genre[]>;
  movieForm: FormGroup;
  roleForm: FormGroup;
  directorForm: FormGroup;

  constructor(  ) {
    this.genres.push( {id: '', name: 'Action'} );
    this.genres.push( {id: '', name: 'Thriller'} );
    this.genres.push( {id: '', name: 'Adventure'} );

    this.movieForm = new FormGroup({
      'title' : new FormControl(null),
      'trailerLink' : new FormControl(null),
      'duration' : new FormControl(null),
      'releaseDate' : new FormControl(null),
      'plotSum' : new FormControl(null),
      'image' : new FormControl(null),
    });

    this.roleForm = new FormGroup({
      'actor': new FormControl(null),
      'role': new FormControl(null)
    });

    this.directorForm = new FormGroup({
      'director': new FormControl(null)
    });
  }

  private _filter(value: any): Genre[] {
    const filterGenres: Genre[] = [];
    if (typeof(value) === 'string') {
      const filterValue = value.toLowerCase();
    this.genres.forEach(genre => {
      if (genre.name.toLowerCase().includes(filterValue)) {
        filterGenres.push(genre);
      }
    });
    }
    return filterGenres;
  }


  ngOnInit() {
    this.filteredGenres = this.genreControl.valueChanges
      .pipe<Genre[]>(
        map(value => this._filter(value))
      );
  }


  remove(genre): void {
    const index = this.movieGenres.indexOf(genre);

    if (index >= 0) {
      this.movieGenres.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value);
    this.movieGenres.push(event.option.value);
    this.genreControl.setValue(null);
  }


}
