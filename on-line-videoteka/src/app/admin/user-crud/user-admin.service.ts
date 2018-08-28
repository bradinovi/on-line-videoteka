import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData, UserData } from '../../userauth/user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
const API_URL = environment.apiUrl;

export interface UserDataAdmin {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  verified: boolean; // must be ISO-8601 date string
}

@Injectable({ providedIn: 'root'})
export class UserAdminService {

  constructor(private http: HttpClient, private router: Router) {}
  private users: UserDataAdmin[];
  private usersUpdated = new Subject<{users: UserDataAdmin[], userCount: number}>();

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUsers( genresPerPage: number, currentPage: number, textSearch: string ) {
    const queryParams = `?pagesize=${genresPerPage}&page=${currentPage}`;
    let textQuery = '';
    if (textSearch !== '') {
      textQuery = `&text=${textSearch}`;
    }
    this.http.get<{message: string, users: any, maxUsers: number}>( API_URL + 'users' + queryParams + textQuery)
    .pipe( map((userData) => {
      return {
        users:
        userData.users.map( user => {
            return {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              dateOfBirth: user.dateOfBirth,
              email: user.email,
              password: user.password,
              role: user.role,
              verified: user.verified
            };
        }),
        maxUsers: userData.maxUsers
      };
    }) )
    .subscribe((transformedUserData) => {
      this.users = transformedUserData.users;
      this.usersUpdated.next({
        users : [...this.users],
        userCount: transformedUserData.maxUsers
      });
    });
  }

  addUser( email: string, password: string, firstName: string, lastName: string, username: string, dateOfBirth: string) {
    const userData: UserData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      username: username,
      dateOfBirth: dateOfBirth
    };
    return this.http.post(API_URL + 'users/signup', userData);
  }

  updateUser( id: string, email: string, password: string, firstName: string, lastName: string, username: string,
    dateOfBirth: string, role: string ) {
    const userData = {
      id: id,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      username: username,
      dateOfBirth: dateOfBirth,
      role: role
    };
    if (password !== 'undefined') {
      userData['password'] = password;
    }

    return this.http.patch(API_URL + 'users', userData);
  }

  deleteUser( id: string) {
    return this.http.delete(API_URL + 'users' + '/' + id);
  }

  toggleUserVerification(userId: string) {
    return this.http.get(API_URL + 'users/toggleverify/' + userId);
  }

}
