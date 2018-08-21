import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../userauth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  forgotPassword = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogIn(logInForm: NgForm) {
    if (logInForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(logInForm.value.email, logInForm.value.password);
  }

  onForgotPassword() {
    this.forgotPassword = true;
  }

  onForgotPassSubmit(forgotForm: NgForm) {

    this.authService.forgotPassword(forgotForm.value.email).subscribe(
      (res) => {
        console.log(res);
        this.forgotPassword = false;
      }
    );
  }

  onBackToLogIn() {
    this.forgotPassword = false;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


}
