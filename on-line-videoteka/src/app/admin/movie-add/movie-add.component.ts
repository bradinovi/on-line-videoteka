import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';


import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import { GenreService } from '../../services/genres.service';
import { Genre } from '../../models/genre.model';
import { MovieService, Director } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { Moment } from '../../../../node_modules/moment';
import { Actor } from '../../models/actor.model';
import { ActorService } from '../../services/actors.service';
import { RoleService } from '../../services/roles.service';
import { RoleOfMovie } from '../../models/role.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';



@Component({
  selector: 'app-movie-add',
  templateUrl: './movie-add.component.html',
  styleUrls: ['./movie-add.component.css']
})
export class MovieAddComponent implements OnInit, OnDestroy {
  saveButton = 'Save';
  mode = 'create';
  movie: Movie;
  movieId: string;
  roleDirectorFormsEnabled = true;
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
  filteredDirectors: Observable<Actor[]>;

  movieForm: FormGroup;
  roleForm: FormGroup;
  directorForm: FormGroup;
  imagePreview = '';
  genresSub: Subscription;
  actorSub: Subscription;
  rolesSub: Subscription;
  directorSub: Subscription;
  createdMovieId: string;

  roles: RoleOfMovie[] = [];
  directors: Director[] = [];
  roleMode = 'create';
  roleToEdit = '';

  @ViewChild('genreInput') genreInput: ElementRef;
  constructor( private genreService: GenreService, private movieService: MovieService,
    private actorsService: ActorService, private roleService: RoleService,
    public route: ActivatedRoute, private router: Router) {
    this.rolesSub = this.roleService.getrolesOfMovieUpdatedListener().subscribe(
      (roleData: {roles: RoleOfMovie[], roleCount: number}) => {
        this.roles = roleData.roles;
        console.log(this.roles);
      }
    );
    this.actorSub = this.actorsService.getActorUpdateListener().subscribe(
      (actorData: { actors: Actor[], actorCount: number }) => {
      this.actors = actorData.actors;
      console.log(this.actors);
    });
    this.directorSub = this.movieService.getDirectorsUpdateListener().subscribe(
      ( directorData: { directors: Director[], movieId: string } ) => {
        this.directors = directorData.directors;
      }
    );
    this.actorsService.getActors(1, 0, '');
    this.movieForm = new FormGroup({
      'title' : new FormControl(null, { validators: [Validators.required] }),
      'trailerLink' : new FormControl(null),
      'duration' : new FormControl(null, { validators: [Validators.required] }),
      'release' : new FormControl(null, { validators: [Validators.required] }),
      'plot' : new FormControl(null, { validators: [Validators.required] }),
      'image' : new FormControl(null, { validators: [Validators.required] })

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
    this.checkAndPrepareUpdate();
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
    this.filteredDirectors = this.directorControl.valueChanges.pipe<Actor[]>(
      map(value => this._filterActor(value))
    );
  }

  private checkAndPrepareUpdate() {
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('id')) {
        this.mode = 'update';
        this.movieId = param.get('id');
        this.isLoading = true;
        this.movieService.getMovie(this.movieId).subscribe((movieData) => {
          this.movie = {
            id: movieData._id,
            title: movieData.title,
            release: movieData.release,
            duration: movieData.duration,
            trailerLink: movieData.trailerLink,
            plotsum: movieData.plotsum,
            genres: movieData.genres.map( genre => genre._id ),
            posterPath: movieData.posterPath,
            rents: movieData.rents
          };
          let imagePath = this.movie.posterPath;
          if ( !imagePath ) {
            imagePath = '/';
          }
          this.movieForm.setValue({
            'title' : this.movie.title,
            'trailerLink' : this.movie.trailerLink,
            'duration' : this.movie.duration,
            'release' : this.movie.release,
            'plot' : this.movie.plotsum,
            'image' : this.movie.posterPath
          });
          this.isLoading = false;
          this.movieGenres = movieData.genres.map( (genre) => ({ id: genre._id, name: genre.name}) );
          this.roleService.getRolesForMovie(this.movieId);
          this.movieService.getMovieDirectors(this.movieId);
          this.roleDirectorFormsEnabled = false;
          this.imagePreview = movieData.posterPath;
          this.createdMovieId = this.movieId;
        });
      } else {
        this.mode = 'create';
        this.movieId = null;
      }
    });
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
        if (actor.lastName != null || actor.lastName != null) {
          if (actor.firstName.toLowerCase().includes(filterValue) || actor.lastName.toLowerCase().includes(filterValue)) {
            filterActors.push(actor);
          }
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
    const file = (event.target as HTMLInputElement).files[0]; // this stores a file object
    this.movieForm.value.image = event.target;
    this.movieForm.patchValue({'image': file});
    this.movieForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
            this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.imagePreview = '';
  }

  saveMovie() {
    if (this.saveButton === 'Finish') {
      this.router.navigate(['moviedetail', this.createdMovieId]);
      return;
    }
    if (this.movieForm.invalid) {
      return;
    }
    if ( this.mode === 'create') {
      this.movieService.addMovie(this.movieForm.value.title, this.dateString(this.movieForm.value.release), this.movieForm.value.duration,
      this.movieForm.value.trailerLink, this.movieForm.value.plot, this.movieGenres, this.movieForm.value.image).subscribe(
      (createdMovie) => {
        this.createdMovieId = createdMovie.createdMovie._id;
        this.movieForm.disable();
        this.roleDirectorFormsEnabled = false;
        this.saveButton = 'Finish';
      }
    );
    } else {
      console.log('UPDATE');
      this.movieService.updateMovie(this.movieId,
      this.movieForm.value.title,
      this.dateString(this.movieForm.value.release),
      this.movieForm.value.duration,
      this.movieForm.value.trailerLink,
      this.movieForm.value.plot, this.movieGenres,
      this.movieForm.value.image , this.movie.rents).subscribe(
      (res) => {
        this.movieForm.disable();
        this.saveButton = 'Finish';
      });
    }

    return;
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
    if (this.roleMode === 'create') {
      this.roleService.addRole(this.roleForm.value.roleName, this.roleForm.value.actor, this.createdMovieId).subscribe((response) => {
        this.roleService.getRolesForMovie(this.createdMovieId);
      });
    } else {
      console.log('ACTOR:' + this.roleForm.value.actor);
      console.log('ROLE NAME:' + this.roleForm.value.roleName);
      console.log('Role to edit:' + this.roleToEdit);
      console.log('Movie:' + this.createdMovieId);
      this.roleService.updateRole(this.roleToEdit, this.roleForm.value.actor, this.createdMovieId, this.roleForm.value.roleName)
      .subscribe((res) => {
        this.roleMode = 'create';
        this.roleService.getRolesForMovie(this.createdMovieId);
      });
    }
    this.actorControl.setValue('');
    this.roleForm.reset();
    return;
  }

  selectedActor(event: MatAutocompleteSelectedEvent) {
    this.setActorValue(this.actorControl, this.roleForm, event.option.value.id,
      event.option.value.firstName, event.option.value.lastName, 'actor');
  }

  selectedDirector(event: MatAutocompleteSelectedEvent) {
    this.setActorValue(this.directorControl, this.directorForm, event.option.value.id,
      event.option.value.firstName, event.option.value.lastName, 'director');
  }

  setActorValue( control, form, actorId, firstName, lastName, controlName: string) {
    if (controlName === 'director') {
      form.patchValue({ 'director': actorId });
    }
    if (controlName === 'actor') {
      form.patchValue({ 'actor': actorId });
    }
    control.setValue(firstName + ' ' + lastName );
  }

  onEditRole(role) {
    if (role.actor !== null) {
      this.setActorValue(this.actorControl, this.roleForm, role.actor._id, role.actor.firstName, role.actor.lastName, 'actor');
    }
    this.roleToEdit = role.id;
    this.roleForm.patchValue({'roleName': role.name });
    this.roleMode = 'edit';
  }

  onDeleteRole(role) {
    this.roleService.deleteRole(role.id).subscribe((res) => {
      this.roleService.getRolesForMovie(this.createdMovieId);
    });
  }

  onAddDirector() {
    this.movieService.addDirector( this.createdMovieId, this.directorForm.value.director ).subscribe(
      (res) => {
        this.directorControl.setValue('');
        this.movieService.getMovieDirectors(this.createdMovieId);
      }
    );
  }

  onDeleteDirector(director) {
    this.movieService.deleteDirector(this.createdMovieId, director.id).subscribe((res) => {
      this.movieService.getMovieDirectors(this.createdMovieId);
    });
  }

  ngOnDestroy() {
    this.genresSub.unsubscribe();
    this.actorSub.unsubscribe();
    this.rolesSub.unsubscribe();
    this.directorSub.unsubscribe();
  }
}
