import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../userauth/userauth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  private isAuthSub: Subscription;
  userAuthenticated = false;
  searchIconColor = 'white';
  isAdmin = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userAuthenticated = this.authService.getIsAuth();
    this.isAdmin = this.authService.getIsAdmin();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => this. userAuthenticated = isAuthenticated
    );
    this.isAuthSub = this.authService.getIsAdminStatusListener().subscribe(
      isAdmin => {this.isAdmin = isAdmin; console.log(isAdmin); }
    );
  }

  onSearchFocused() {
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
      event.target.value = '';
    }
  }

  ngOnDestroy() {
    this.isAuthSub.unsubscribe(),
    this.authListenerSubs.unsubscribe();
  }
}
