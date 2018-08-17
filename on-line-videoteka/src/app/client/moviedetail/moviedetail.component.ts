import { Component, OnInit } from '@angular/core';
import { RoleOfMovie } from '../../models/role.model';
import { Director, MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { RoleService } from '../../services/roles.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { ActivatedRoute, ParamMap } from '../../../../node_modules/@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'app-moviedetail',
  templateUrl: './moviedetail.component.html',
  styleUrls: ['./moviedetail.component.css']
})
export class MoviedetailComponent implements OnInit {
  isLoading = true;
  roles: RoleOfMovie[] = [];
  directors: Director[] = [];
  movie: Movie;

  movieYear: string;
  movieReleaseDate: string;

  rolesSub: Subscription;
  directorSub: Subscription;

  constructor( private roleService: RoleService, private movieService: MovieService, public route: ActivatedRoute ) { }

  ngOnInit() {
    this.rolesSub = this.roleService.getrolesOfMovieUpdatedListener().subscribe(
      (roleData: {roles: RoleOfMovie[], roleCount: number}) => {
        this.roles = roleData.roles;
        console.log(this.roles);
      }
    );
    this.directorSub = this.movieService.getDirectorsUpdateListener().subscribe(
      ( directorData: { directors: Director[], movieId: string } ) => {
        this.directors = directorData.directors;
        console.log(this.directors);

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
              trailerLink: movie.trailerLink
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


}
