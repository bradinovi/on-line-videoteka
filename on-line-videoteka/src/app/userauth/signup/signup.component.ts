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
  private authStatusSub: Subscription;

  passwordsNotMatchingErr = false;
  termsConfirmErr = false;
  passwordFormatErr = false;

  isLoading = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignUp(signUpForm: NgForm) {

    if ((signUpForm.value.passwordConfirm !== signUpForm.value.password) && !signUpForm.value.termsConfirm) {
      console.log('pass not matching + terms and cond');
      this.passwordsNotMatchingErr = true;
      this.termsConfirmErr = true;
      return;
    } else { this.passwordsNotMatchingErr = false; this.termsConfirmErr = false; }

    if (signUpForm.value.passwordConfirm !== signUpForm.value.password) {
      console.log('pass not matching');
      this.passwordsNotMatchingErr = true;
      return;
    } { this.passwordsNotMatchingErr = false; }

    if (!signUpForm.value.termsConfirm) {
      console.log('terms and cond');
      this.termsConfirmErr = true;
      return;
    } else { this.termsConfirmErr = false; }

  const regexpPass = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/);
    let pas: string;
    pas = signUpForm.value.password;
    if ( !regexpPass.test(signUpForm.value.password) || (pas.length) < 6) {
      this.passwordFormatErr = true;
      return;
    } else { this.passwordFormatErr = false; }
    if (signUpForm.invalid) {
      return;
    }


    this.passwordsNotMatchingErr = false;
    this.termsConfirmErr = false;
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
