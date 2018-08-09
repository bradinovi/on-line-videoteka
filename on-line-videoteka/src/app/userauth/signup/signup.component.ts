import { Component, OnInit, OnDestroy } from '@angular/core';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { NgForm } from '@angular/forms';

import {MomentDateAdapter} from '@angular/material-moment-adapter';

import { UserData } from '../user.model';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.gggg'
  },
  display: {
    dateInput: 'DD.MM.gggg',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD.MM.gggg',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthService } from '../userauth.service';
const moment = _moment;


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class SignupComponent implements OnInit, OnDestroy {

  private userData: UserData;

  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignUp(signUpForm: NgForm) {
    if (signUpForm.invalid) {
      return;
    }
    this.userData = {
      email: signUpForm.value.email,
      firstName: signUpForm.value.firstName,
      lastName: signUpForm.value.lastName,
      password: signUpForm.value.password,
      username: signUpForm.value.username,
      dateOfBirth: signUpForm.value.dateOfBirth.toISOString()
    };
    console.log(this.userData);
    this.isLoading = true;
    this.authService.createUser(
      signUpForm.value.email,
      signUpForm.value.password,
      signUpForm.value.firstName,
      signUpForm.value.lastName,
      signUpForm.value.username,
      signUpForm.value.dateOfBirth.toISOString()
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
