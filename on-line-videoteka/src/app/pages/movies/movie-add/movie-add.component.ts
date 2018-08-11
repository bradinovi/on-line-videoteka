import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatAutocompleteSelectedEvent} from '@angular/material';
import { NgForm } from '@angular/forms';




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
  duration: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  genreControl = new FormControl();
  // genres: string[] = ['One', 'Two', 'Three'];
  genres: Genre[] = [];
  filteredGenres: Observable<Genre[]>;

  constructor(fb: FormBuilder) {
    this.duration = fb.group({
      area: '',
      exchange: '',
      subscriber: '',
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
    const index = this.genres.indexOf(genre);

    if (index >= 0) {
      this.genres.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.genres.push(event.option.value);
    this.genreControl.setValue(null);
  }


}
