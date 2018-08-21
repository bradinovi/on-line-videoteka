import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserData } from '../../userauth/user.model';
import { Movie } from '../../models/movie.model';
import {map} from 'rxjs/operators';
import { UserAdminService } from '../user-crud/user-admin.service';
import { Subscription, Observable } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { MatAutocompleteSelectedEvent, PageEvent } from '@angular/material';
import { RentService } from '../../services/rents.service';
import { RentAdminService } from './rents.admin.service';
import { Moment } from 'moment';
import { Rent } from '../../models/rent.model';

@Component({
  selector: 'app-rents-crud',
  templateUrl: './rents-crud.component.html',
  styleUrls: ['./rents-crud.component.css']
})
export class RentsCrudComponent implements OnInit {
  mode = 'create';
  formShow = false;
  totalRents: number;
  currentPage = 1;
  rentsPerPage = 5;
  pageSizeOptions = [ 5, 10, 20, 30 ];
  displayedColumns = [ 'User', 'Movie', 'RentDay', 'Duration', 'Actions' ];
  form: FormGroup;

  rentId: string;
  movieId: string;
  userId: string;

  rents: Rent[];
  users: UserData[];
  movies: Movie[];
  filteredUsers: Observable<UserData[]>;
  filteredMovies: Observable<Movie[]>;

  userControl = new FormControl();
  movieControl = new FormControl();
  userSub: Subscription;
  movieSub: Subscription;
  rentSub: Subscription;

  constructor(private userService: UserAdminService, private movieService: MovieService,
    private rentsService: RentAdminService) { }

  ngOnInit() {
    this.rentSub = this.rentsService.getRentsUpdateListener().subscribe(
      (rentData) => {
        this.rents = rentData.rents;
        this.totalRents = rentData.count;
        console.log(this.rents);
      }
    );
    this.rentsService.getRents(this.rentsPerPage, this.currentPage);

    this.form = new FormGroup(
      {
        'duration': new FormControl(),
        'rentDay': new FormControl(),
        'movie': new FormControl(),
        'user': new FormControl(),
      }
    );

    this.userSub = this.userService.getUsersUpdateListener().subscribe(
      userData => {
        this.users = userData.users;

      }
    );
    this.userService.getUsers(5, 1);

    this.movieSub = this.movieService.getMovieUpdateListener().subscribe(
      movieData => {
        this.movies = movieData.movies;

      }
    );
    this.movieService.getMovies(1, 0, 'undefined', 'undefined', 'undefined', 'undefined');

    this.filteredUsers = this.userControl.valueChanges.pipe<UserData[]>(
      map(value => this._filterUsers(value))
    );
    this.filteredMovies = this.movieControl.valueChanges.pipe<Movie[]>(
      map(value => this._filterMovies(value))
    );

  }

  private _filterUsers(value: any): UserData[] {
    // console.log(value);
    const filterUsers: UserData[] = [];
    if (typeof(value) === 'string') {
      const filterValue = value.toLowerCase();
    this.users.forEach(user => {
      if (user.firstName.toLowerCase().includes(filterValue) || user.lastName.toLowerCase().includes(filterValue) ||
      user.username.toLowerCase().includes(filterValue)) {
        filterUsers.push(user);

      }
    });
    }
    return filterUsers;
  }

  private _filterMovies(value: any): Movie[] {
    const filterMovies: Movie[] = [];
    if (typeof(value) === 'string') {
      const filterValue = value.toLowerCase();
    this.movies.forEach(movie => {
      if (movie.title.toLowerCase().includes(filterValue)) {
        filterMovies.push(movie);
      }
    });
    }
    return filterMovies;
  }


  selectedMovie(event: MatAutocompleteSelectedEvent) {
    this.form.patchValue({ 'movie': event.option.value.id });
    this.movieControl.setValue(event.option.value.title);
  }

  selectedUser(event: MatAutocompleteSelectedEvent) {
    this.form.patchValue({ 'user': event.option.value.id });
    this.userControl.setValue(event.option.value.username);
  }

  onSave() {
    if (this.mode === 'create') {
      this.rentsService.rentMovie(this.form.value.user, this.form.value.movie, this.form.value.duration,
        this.dateString(this.form.value.rentDay)).subscribe(
          (createData) => {
            this.rentsService.getRents(this.rentsPerPage, this.currentPage);
          }
        );
    } else {
      this.rentsService.updateRent(
        this.rentId, this.form.value.user, this.form.value.movie, this.form.value.duration,
        this.dateString(this.form.value.rentDay)).subscribe(
          (upadateData) => {
            this.rentsService.getRents(this.rentsPerPage, this.currentPage);
          }
        );
    }
  }

  onClear() {
    this.form.reset();
    this.userControl.reset();
    this.movieControl.reset();
    this.formShow = false;
  }


  onCreate() {
    this.formShow = true;
    this.mode = 'create';
  }

  dateString(date: string | Moment) {
    if ( date === null) {
      return '';
    }
    if (typeof(date) === 'object') {
      return date.toISOString();
    }
    return date;
  }

  onEdit(element) {
    this.formShow = true;
    this.form.patchValue({'movie': element.movie.id});
    this.form.patchValue({'user': element.user.id});
    this.form.patchValue({'duration': element.duration});
    this.form.patchValue({'rentDay': element.rentDay});
    this.userControl.setValue(element.user.username);
    this.movieControl.setValue(element.movie.title);
    this.rentId = element.id;
    this.mode = 'update';
  }

  onDelete(element) {
    this.rentsService.deleteRent(element.id).subscribe(
        (upadateData) => {
          this.rentsService.getRents(this.rentsPerPage, this.currentPage);
        }
      );
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.rentsPerPage = pageData.pageSize;
    this.rentsService.getRents(this.rentsPerPage, this.currentPage);
  }

}
