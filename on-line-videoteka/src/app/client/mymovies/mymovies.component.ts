import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { RentService } from '../../services/rents.service';

@Component({
  selector: 'app-mymovies',
  templateUrl: './mymovies.component.html',
  styleUrls: ['./mymovies.component.css']
})
export class MymoviesComponent implements OnInit {

  isDataAvailable = false;
  moviesToDisplayAct: Movie[] = [];
  moviesToDisplayExp: Movie[] = [];

  constructor(private http: HttpClient, private rentService: RentService) {}
  ngOnInit() {
    this.rentService.getMyMovies();
  }
}
