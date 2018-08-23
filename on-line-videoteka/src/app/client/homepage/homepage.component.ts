import { Component, OnInit} from '@angular/core';


import { NgModule } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

@NgModule({

})

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],


})
export class HomepageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

}
