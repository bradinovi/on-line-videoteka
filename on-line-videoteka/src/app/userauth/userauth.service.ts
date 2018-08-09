import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData, UserData } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { apiLinks } from '../API-links';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private userRole: string;
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  private userId: string;

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getRole() {
    return this.userRole;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser( email: string, password: string, firstName: string, lastName: string, username: string, dateOfBirth: string) {
    const userData: UserData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      username: username,
      dateOfBirth: dateOfBirth };
    return this.http.post(apiLinks.register, userData).subscribe(() => {
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{token: string, expiresIn: number, userId: string, role: string}>(apiLinks.login, authData)
    .subscribe( response => {
      console.log(response);
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, response.userId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    }
  );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.userId = null;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
