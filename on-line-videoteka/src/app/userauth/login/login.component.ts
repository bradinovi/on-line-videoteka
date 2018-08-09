import { Component, OnInit } from '@angular/core';
import { NgForm } from '../../../../node_modules/@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userEmail: string;
  userPassword: string;

  forgotPassword = false;

  constructor() { }

  ngOnInit() {
  }

  onLogIn(logInForm: NgForm) {
    if (logInForm.invalid) {
      return;
    }
    this.userEmail = logInForm.value.email;
    this.userPassword = logInForm.value.password;
  }

  onForgotPassword() {
    this.forgotPassword = true;
  }

  onBackToLogIn() {
    this.forgotPassword = false;
  }

}
