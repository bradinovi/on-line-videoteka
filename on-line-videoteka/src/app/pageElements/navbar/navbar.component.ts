import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  searchIconColor = 'white';

  constructor() { }

  ngOnInit() {
  }

  onSearchFocused() {
    console.log('tedasdasdas');
    this.searchIconColor = 'accent';
  }

  onSearchBlur() {
    this.searchIconColor = 'white';
  }

}
