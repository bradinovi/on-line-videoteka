import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-mymovies',
  templateUrl: './mymovies.component.html',
  styleUrls: ['./mymovies.component.css']
})
export class MymoviesComponent implements OnInit {

  isDataAvailable = false;
  moviesToDisplayAct: Movie[] = [];
  moviesToDisplayExp: Movie[] = [];

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      for (let i = 0; i < 5; i++) {
        this.moviesToDisplayAct.push(data[i]);
      }
      for (let i = 5; i < data.length; i++) {
        this.moviesToDisplayExp.push(data[i]);
      }
      this.isDataAvailable = true;
    });
   }

  ngOnInit() {

  }

  public getJSON(): Observable<any> {
    return this.http.get('./assets/movies.json');
  }


}
