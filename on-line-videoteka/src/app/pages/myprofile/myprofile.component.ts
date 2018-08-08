import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  private profileInfoEdit = false;
  private passwordEdit = false;

  userfirstName: string;
  userlastName: string;
  useremail: string;
  userdateOfBirth: string;

  useroldPassword: string;
  usernewPassword: string;

  constructor() { }

  ngOnInit() {
  }

  onChangeInfoBtn() {
    this.profileInfoEdit = true;
  }

  onChangePasswordBtn() {
    this.passwordEdit = true;
  }

  onBackButton() {
    this.profileInfoEdit = false;
    this.passwordEdit = false;
  }

}
