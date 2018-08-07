import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-moviecardgrid',
  templateUrl: './moviecardgrid.component.html',
  styleUrls: ['./moviecardgrid.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MoviecardgridComponent implements OnInit {
  isDataAvailable = false;
  moviesToDisplay: Movie[];

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      this.moviesToDisplay = data;
      console.log(this.moviesToDisplay);
      this.isDataAvailable = true;
    });
   }

  ngOnInit() {

  }

  public getJSON(): Observable<any> {
    return this.http.get('./assets/movies.json');
  }


}
