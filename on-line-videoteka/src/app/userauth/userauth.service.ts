import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData, UserData } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl;


@Injectable({ providedIn: 'root'})
export class AuthService {
  private isAdmin = false;
  private isAuthenticated = false;
  private token: string;
  private isAdminStatusListener = new Subject<boolean>();
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
  getIsAdmin() {
    return this.isAdmin;
  }

  getIsAdminStatusListener() {
    return this.isAdminStatusListener.asObservable();
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserData() {
    return this.http.get<any>(API_URL + 'users/myprofile');
  }

  createUser( email: string, password: string, firstName: string, lastName: string, username: string, dateOfBirth: string) {
    const userData: UserData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      username: username,
      dateOfBirth: dateOfBirth };
    return this.http.post(API_URL + 'users/signup', userData).subscribe(() => {
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  forgotPassword(email: string) {
    return this.http.post<any>(API_URL + 'users/forgotpassword', { email: email });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{token: string, expiresIn: number, userId: string, role: string}>(API_URL + 'users/login', authData)
    .subscribe( response => {
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
        this.saveAuthData(token, expirationDate, response.userId, response.role);
        this.router.navigate(['/userhome']);
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
      if (authInformation.role) {
        this.isAdminStatusListener.next(true);
        this.isAdmin = true;
      }
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.isAdminStatusListener.next(false);
    this.router.navigate(['/']);
    this.userId = null;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  changePassword(email: string, newPass: string, oldPass: string) {
    return this.http.patch<any>(API_URL + 'users/userpass', { email: email, oldPassword: oldPass, newPassword: newPass });
  }

  changeUserInfo(username: string, firstName: string, lastName: string, dateOfBirth: string) {
    return this.http.patch<any>(API_URL + 'users/userinfo',
    { firstName: firstName, lastName: lastName, username: username, dateOfBirth: dateOfBirth });
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    if (role === 'admin') {
      this.isAdminStatusListener.next(true);
      this.isAdmin = true;
      localStorage.setItem('role', role);
    } else {
      this.isAdminStatusListener.next(false);
    }
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (!token && !expirationDate) {
      return;
    }
    const authData: {token: string, expirationDate: Date, userId: string, role?: string} = {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
    if (role) {
      authData['role'] = role;
    }
    return authData;
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
