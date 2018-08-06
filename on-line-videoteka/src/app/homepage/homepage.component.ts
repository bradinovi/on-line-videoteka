import { Component, OnInit} from '@angular/core';
import { MoviecardComponent } from '../moviecard/moviecard.component';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MoviecardComponent]
})

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],


})
export class HomepageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
