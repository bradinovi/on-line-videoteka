import { Component, OnInit } from '@angular/core';
import { AuthService } from '../userauth/userauth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private authListenerSubs: Subscription;
  userAuthenticated = false;
  searchIconColor = 'white';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this. userAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => { this. userAuthenticated = isAuthenticated; }
    );
  }

  onSearchFocused() {
    console.log('tedasdasdas');
    this.searchIconColor = 'accent';
  }

  onSearchBlur() {
    this.searchIconColor = 'white';
  }

  onLogOut() {
    this.authService.logout();
  }

  onHitEnter(event) {
    if (event.key === 'Enter') {
      this.router.navigate(['/searchpage', event.target.value]);
    }
  }

}
