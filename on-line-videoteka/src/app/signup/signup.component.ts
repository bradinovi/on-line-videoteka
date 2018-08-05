import { Component, OnInit } from '@angular/core';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { NgForm } from '@angular/forms';

import {MomentDateAdapter} from '@angular/material-moment-adapter';

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
export class SignupComponent implements OnInit {

  //dateOfBirth = new Date();

  constructor() {
    moment.locale('HRV');
  }

  ngOnInit() {

  }

  onSignUp(signUpForm: NgForm) {
    console.log(signUpForm);
    if (signUpForm.invalid) {
      return;
    }

  }

}
