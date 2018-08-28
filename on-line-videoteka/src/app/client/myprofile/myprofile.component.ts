import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../userauth/userauth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Moment } from 'moment';
Date.prototype.toString = function() {
  const parts = this.toLocaleString()
  .split(',')
  .join('')
  .split('/');
  let date = [parts[1], parts[0] , parts[2].split(' ')[0]].join('.');
  if ( date === '1.1.1970') {
    date = 'N/A';
  }
  return date;
};
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyprofileComponent implements OnInit {
  profileInfoEdit = false;
  passwordEdit = false;
  myprofile: any;
  userfirstName: string;
  userlastName: string;
  useremail: string;
  userdateOfBirth: string;
  dateOfBirth: Date;
  useroldPassword: string;
  usernewPassword: string;
  passwordsNotMatchingErr = false;
  passwordFormatErr = false;
  isLoading = true;
  constructor(private authService: AuthService) { }

  passwordForm: FormGroup;
  profileInfoForm: FormGroup;

  ngOnInit() {
    this.authService.getUserData().subscribe(
      (data) => {
        this.myprofile = data.myprofile;
        this.isLoading = false;
        this.dateOfBirth = new Date(data.myprofile.dateOfBirth);
      }
    );

    this.profileInfoForm = new FormGroup(
      {
        'firstName': new FormControl(null),
        'lastName': new FormControl(null),
        'dateOfBirth': new FormControl(null),
        'username': new FormControl(null),
      }
    );

    this.passwordForm = new FormGroup(
      {
        'oldPassword': new FormControl(null),
        'newPassword': new FormControl(null),
        'newPasswordConfirm': new FormControl(null)
      }
    );
  }

  onChangeInfoBtn() {
    this.profileInfoEdit = true;
    this.profileInfoForm.setValue(
      {
        'firstName': this.myprofile.firstName,
        'lastName': this.myprofile.lastName,
        'dateOfBirth': this.myprofile.dateOfBirth,
        'username': this.myprofile.username
      }
    );
  }

  onChangePasswordBtn() {
    this.passwordEdit = true;
  }

  onBackButton() {
    this.profileInfoEdit = false;
    this.passwordEdit = false;
  }

  onProfileInfoChange() {

    this.authService.changeUserInfo(this.profileInfoForm.value.username, this.profileInfoForm.value.firstName
    , this.profileInfoForm.value.lastName, this.dateString(this.profileInfoForm.value.dateOfBirth)).subscribe(
      data => {
        this.profileInfoEdit = false;
        this.authService.getUserData().subscribe(
          (dataUpdated) => {
            this.myprofile = dataUpdated.myprofile;
            this.isLoading = false;
            this.dateOfBirth = new Date(data.myprofile.dateOfBirth);
          }
        );
      }
    );
  }

  onPasswordChange() {
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.newPasswordConfirm) {
      this.passwordsNotMatchingErr = true;
      return;
    } else { this.passwordsNotMatchingErr = false; }
    const regexpPass = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/);
    if ( !regexpPass.test(this.passwordForm.value.newPassword) || (this.passwordForm.value.newPassword.length) < 6) {
      this.passwordFormatErr = true;
      return;
    } else { this.passwordFormatErr = false; }
    this.authService.changePassword(this.myprofile.email, this.passwordForm.value.newPassword, this.passwordForm.value.oldPassword)
    .subscribe(
      res => {
        this.passwordEdit = false;
      }
    );

  }
  dateString(date: string | Moment) {
    if ( date === null) {
      return '';
    }
    if (typeof(date) === 'object') {
      return date.toISOString();
    }
    return date;
  }
}
