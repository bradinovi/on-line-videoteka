import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';


import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import { GenreService } from '../../services/genres.service';
import { Genre } from '../../models/genre.model';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { Moment } from '../../../../node_modules/moment';
import { Actor } from '../../models/actor.model';
import { ActorService } from '../../services/actors.service';
import { RoleService } from '../../services/roles.service';
import { RoleOfMovie } from '../../models/role.model';



@Component({
  selector: 'app-movie-add',
  templateUrl: './movie-add.component.html',
  styleUrls: ['./movie-add.component.css']
})
export class MovieAddComponent implements OnInit, OnDestroy {
  saveButton = 'Save';
  roleDirectorFormsEnabled = false;
  isLoading = true;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  genreControl = new FormControl();
  genres: Genre[] = [];
  movieGenres: Genre[] = [];
  filteredGenres: Observable<Genre[]>;

  actorControl = new FormControl();
  directorControl = new FormControl();
  actors: Actor[] = [];
  filteredActors: Observable<Actor[]>;

  movieForm: FormGroup;
  roleForm: FormGroup;
  directorForm: FormGroup;
  imagePreview = '';
  genresSub: Subscription;
  actorSub: Subscription;
  rolesSub: Subscription;
  createdMovieId: string;

  roles: RoleOfMovie[];

  @ViewChild('genreInput') genreInput: ElementRef;
  constructor( private genreService: GenreService, private movieService: MovieService,
    private actorsService: ActorService, private roleService: RoleService ) {
    this.rolesSub = this.roleService.getrolesOfMovieUpdatedListener().subscribe(
      (roleData: {roles: RoleOfMovie[], roleCount: number}) => {
        this.roles = roleData.roles;
      }
    );
    this.actorSub = this.actorsService.getActorUpdateListener().subscribe(
      (actorData: { actors: Actor[], actorCount: number }) => {
      this.actors = actorData.actors;
    });
    this.actorsService.getActors(1, 0);
    this.movieForm = new FormGroup({
      'title' : new FormControl(null),
      'trailerLink' : new FormControl(null),
      'duration' : new FormControl(null),
      'release' : new FormControl(null),
      'plot' : new FormControl(null),
      'image' : new FormControl(null)

    });
    this.roleForm = new FormGroup({
      'actor': new FormControl(null),
      'roleName': new FormControl(null)
    });
    this.directorForm = new FormGroup({
      'director': new FormControl(null)
    });
  }

  ngOnInit() {
    this.genresSub = this.genreService.getGenreUpdateListener().subscribe(
      (genreData: {genres: Genre[], genreCount: number }) => {
        this.isLoading = false;
        this.genres = genreData.genres;
      }
    );
    this.genreService.getGenres(9999999, 1);
    this.filteredGenres = this.genreControl.valueChanges
      .pipe<Genre[]>(
        map(value => this._filterGenre(value))
      );
    this.filteredActors = this.actorControl.valueChanges.pipe<Actor[]>(
      map(value => this._filterActor(value))
    );
  }

  private _filterGenre(value: any): Genre[] {
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

  private _filterActor(value: any): Actor[] {
    const filterActors: Actor[] = [];
    if (typeof(value) === 'string') {
      const filterValue = value.toLowerCase();
    this.actors.forEach(actor => {
      if (actor.firstName.toLowerCase().includes(filterValue) || actor.lastName.toLowerCase().includes(filterValue) ) {
        filterActors.push(actor);
      }
    });
    }
    return filterActors;
  }

  removeGenre(genre): void {
    const index = this.movieGenres.indexOf(genre);
    if (index >= 0) {
      this.movieGenres.splice(index, 1);
    }
  }

  selectedGenre(event: MatAutocompleteSelectedEvent): void {
    this.genreInput.nativeElement.value = '';
    this.movieGenres.push(event.option.value);
    this.genreControl.setValue(null);
  }

  onImageChosen(event: Event) {
    console.log('a');
    const file = (event.target as HTMLInputElement).files[0]; // this stores a file object
    this.movieForm.value.image = event.target;
    this.movieForm.patchValue({'image': file});
    this.movieForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
            this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.imagePreview = '';
  }

  saveMovie() {
    console.log(this.movieForm);
    console.log(this.selectedGenre);
    this.movieService.addMovie(this.movieForm.value.title, this.dateString(this.movieForm.value.release), this.movieForm.value.duration,
    this.movieForm.value.trailerLink, this.movieForm.value.plot, this.movieGenres, this.movieForm.value.image).subscribe(
      (createdMovie) => {
        console.log(createdMovie);
        this.createdMovieId = createdMovie.createdMovie._id;
        this.movieForm.disable();
        this.roleDirectorFormsEnabled = false;
        this.saveButton = 'Finish';
      }
    );
    return;
  }

  ngOnDestroy() {
    this.genresSub.unsubscribe();
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

  onAddRole() {
    console.log(this.roleForm.value);
    console.log(this.createdMovieId);
    this.roleService.addRole(this.roleForm.value.roleName, this.roleForm.value.actor, this.createdMovieId).subscribe((response) => {
      this.roleService.getRolesForMovie(this.createdMovieId);
    });
    return;
  }

  selectedActor(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
    this.roleForm.patchValue({'actor': event.option.value.id });
    console.log(this.roleForm.value.actor);
    this.actorControl.setValue(event.option.value.firstName + ' ' + event.option.value.lastName);
  }
}
