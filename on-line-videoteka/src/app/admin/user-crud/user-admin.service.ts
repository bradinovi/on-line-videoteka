import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData, UserData } from '../../userauth/user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';



@Injectable({ providedIn: 'root'})
export class UserAdminService {

  constructor(private http: HttpClient, private router: Router) {}
  private users: UserData[];
  private usersUpdated = new Subject<{users: UserData[], userCount: number}>();

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUsers( genresPerPage: number, currentPage: number ) {
    const queryParams = `?pagesize=${genresPerPage}&page=${currentPage}`;
    this.http.get<{message: string, users: any, maxUsers: number}>( 'http://localhost:3000/api/users' + queryParams)
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
              role: user.role
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
    return this.http.post('http://localhost:3000/api/users/signup', userData);
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

    return this.http.patch('http://localhost:3000/api/users', userData);
  }

  deleteUser( id: string) {
    return this.http.delete('http://localhost:3000/api/users' + '/' + id);
  }


}
