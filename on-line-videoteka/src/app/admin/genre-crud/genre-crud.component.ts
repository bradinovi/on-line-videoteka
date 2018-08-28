import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '../../../../node_modules/@angular/material';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { Subscription } from '../../../../node_modules/rxjs';
import { GenreService } from '../../services/genres.service';
import { Genre } from '../../models/genre.model';

@Component({
  selector: 'app-genre-crud',
  templateUrl: './genre-crud.component.html',
  styleUrls: ['./genre-crud.component.css']
})
export class GenreCrudComponent implements OnInit, OnDestroy {
  formShow = false;
  isLoading = false;
  currentPage = 1;
  totalGenres: number;
  genresPerPage = 5;
  pageSizeOptions = [5, 10, 20, 30];
  genres: Genre[];
  form: FormGroup;
  displayedColumns = ['Name', 'Actions'];
  mode = 'create';
  genreId = '';

  genreSub: Subscription;

  constructor(public genreService: GenreService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl(null, { validators: [Validators.required] })
    });
    this.genreSub = this.genreService.getGenreUpdateListener().subscribe(
      (genreData: {genres: Genre[], genreCount: number }) => {
      this.isLoading = false;
      this.totalGenres = genreData.genreCount;
      this.genres = genreData.genres;
    });
    this.genreService.getGenres(this.genresPerPage, this.currentPage);
  }

  onCreate() {
    if (this.formShow) {
      this.formShow = false;
      this.form.reset();
    } else {
      this.formShow = true;
      this.mode = 'create';
    }
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.genresPerPage = pageData.pageSize;
    this.genreService.getGenres(this.genresPerPage, this.currentPage);
  }

  onSave() {
    if (this.mode === 'create') {
      this.genreService.addGenre(this.form.value.name).subscribe((response) => {
        this.genreService.getGenres(this.genresPerPage, this.currentPage);
      });
    } else {
      this.genreService.updateGenre(this.genreId, this.form.value.name).subscribe((response) => {
        this.genreService.getGenres(this.genresPerPage, this.currentPage);
        this.formShow = false;
        this.form.reset();
      });
    }
  }

  onEdit(element) {
    this.formShow = true;
    this.form.setValue({'name': element.name});
    this.genreId = element.id;
    this.mode = 'update';
  }

  onDelete(element) {
    this.genreService.deleteGenre(element.id).subscribe(
      (response) => {
        this.genreService.getGenres(this.genresPerPage, this.currentPage);
      }
    );
  }

  ngOnDestroy() {
    this.genreSub.unsubscribe();
  }
}
