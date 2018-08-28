import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { RoleOfMovie } from '../../models/role.model';
import { Director, MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { RoleService } from '../../services/roles.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { ActivatedRoute, ParamMap } from '../../../../node_modules/@angular/router';

import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { MovieDeleteDialogComponent } from './movie-delete-dialog/movie-delete-dialog.component';
import { AuthService } from '../../userauth/userauth.service';
import { RentDialogComponent } from '../rent-dialog/rent-dialog.component';

@Component({
  selector: 'app-moviedetail',
  templateUrl: './moviedetail.component.html',
  styleUrls: ['./moviedetail.component.css']
})
@Injectable()
export class MoviedetailComponent implements OnInit, OnDestroy {
  isLoading = true;
  roles: RoleOfMovie[] = [];
  directors: Director[] = [];
  movie: Movie;
  isAdmin = false;
  movieYear: string;
  movieReleaseDate: string;

  rolesSub: Subscription;
  directorSub: Subscription;
  isAuthSub: Subscription;

  constructor( private roleService: RoleService, private movieService: MovieService, public route: ActivatedRoute,
   private dialog: MatDialog, private authService: AuthService ) { }

  ngOnInit() {

    this.isAdmin = this.authService.getIsAdmin();

    this.isAuthSub = this.authService.getIsAdminStatusListener().subscribe(
      isAdmin => {this.isAdmin = isAdmin; console.log(isAdmin); }
    );

    this.rolesSub = this.roleService.getrolesOfMovieUpdatedListener().subscribe(
      (roleData: {roles: RoleOfMovie[], roleCount: number}) => {
        this.roles = roleData.roles;
      }
    );
    this.directorSub = this.movieService.getDirectorsUpdateListener().subscribe(
      ( directorData: { directors: Director[], movieId: string } ) => {
        this.directors = directorData.directors;
      }
    );

    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('movieId')) {
        this.movieService.getMovie(param.get('movieId')).subscribe(
          movie => {
            const movieToDisplay: Movie = {
              id: movie._id,
              title: movie.title,
              release: movie.release,
              duration: movie.duration,
              plotsum: movie.plotsum,

              genres: movie.genres.map( genre => {
                return genre.name;
              }),
              posterPath: movie.posterPath,
              trailerLink: movie.trailerLink,
              rents: movie.rents
            };
          this.movie = movieToDisplay;
          this.roleService.getRolesForMovie(this.movie.id);
          this.movieService.getMovieDirectors(this.movie.id);
          this.movieYear = moment(this.movie.release).format('Y');
          this.movieReleaseDate = moment(this.movie.release).format('ll');
          this.isLoading = false;
          }
        );
      }
    });


  }

  onDeleteMovie() {
    const dialogRef = this.dialog.open(MovieDeleteDialogComponent, { data: { id: this.movie.id } });
  }

  onRent() {
    const data = {
      movieId: this.movie.id,
      posterPath: this.movie.posterPath,
      title: this.movie.title
    };
    this.dialog.open(RentDialogComponent, { data: data, maxWidth: '30%'});
  }

  ngOnDestroy() {
    this.rolesSub.unsubscribe();
    this.directorSub.unsubscribe();
    this.isAuthSub.unsubscribe();
  }
}
