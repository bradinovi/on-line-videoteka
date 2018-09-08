import { Component, OnInit, OnDestroy } from '@angular/core';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  public signUpForm: FormGroup;
  passwordsNotMatchingErr = false;
  termsConfirmErr = false;
  passwordFormatErr = false;
  maxDate = moment().subtract(18, 'years').toDate();
  isLoading = true;

  constructor(public authService: AuthService) {


  }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      'firstName': new FormControl(null),
      'lastName': new FormControl(null),
      'username': new FormControl(null, { validators: [Validators.required] }),
      'email': new FormControl(null, { validators: [Validators.required, Validators.email] }),
      'dateOfBirth': new FormControl(null),
      'password': new FormControl(null),
      'passwordConfirm': new FormControl(null, { validators: [Validators.required] }),
      'termsConfirm': new FormControl(null, { validators: [Validators.required] })
    });
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.isLoading = false;
  }

  onSignUp() {
    console.log(this.signUpForm);

    if ((this.signUpForm.value.passwordConfirm !== this.signUpForm.value.password) && !this.signUpForm.value.termsConfirm) {
      this.passwordsNotMatchingErr = true;
      this.termsConfirmErr = true;
      return;
    } else { this.passwordsNotMatchingErr = false; this.termsConfirmErr = false; }

    if (this.signUpForm.value.passwordConfirm !== this.signUpForm.value.password) {
      this.passwordsNotMatchingErr = true;
      return;
    } { this.passwordsNotMatchingErr = false; }

    if (!this.signUpForm.value.termsConfirm) {
      this.termsConfirmErr = true;
      return;
    } else { this.termsConfirmErr = false; }

    const regexpPass = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/);
    let pas: string;
    pas = this.signUpForm.value.password;
    if ( !regexpPass.test(this.signUpForm.value.password) || (pas.length) < 6) {
      this.passwordFormatErr = true;
      return;
    } else { this.passwordFormatErr = false; }
    if (this.signUpForm.invalid) {
      return;
    }


    this.passwordsNotMatchingErr = false;
    this.termsConfirmErr = false;
    this.isLoading = true;
    this.authService.createUser(
      this.signUpForm.value.email,
      this.signUpForm.value.password,
      this.signUpForm.value.firstName,
      this.signUpForm.value.lastName,
      this.signUpForm.value.username,
      this.signUpForm.value.dateOfBirth.toISOString()
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
