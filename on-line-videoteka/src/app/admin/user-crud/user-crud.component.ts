import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { UserAdminService } from './user-admin.service';
import { UserData } from '../../userauth/user.model';
import { Moment } from 'moment';

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.css']
})
export class UserCrudComponent implements OnInit, OnDestroy {
  textSearch = '';
  passwordChange = false;
  users: UserData[];
  formShow = false;
  isLoading = false;
  currentPage = 1;
  totalUsers: number;
  usersPerPage = 5;
  pageSizeOptions = [5, 10, 20, 30];
  form: FormGroup;
  displayedColumns = ['Username', 'First Name', 'Last Name', 'Email', 'Date of birth', 'Role', 'Actions'];
  mode = 'create';
  userId = '';
  isAdmin = true;
  userSub: Subscription;

  constructor( private userService: UserAdminService ) { }

  ngOnInit() {
    this.userSub = this.userService.getUsersUpdateListener().subscribe(
      (userData) => {
        this.users = userData.users;
        this.totalUsers = userData.userCount;
      }
    );
    this.userService.getUsers(5, 1, '');
    this.form = new FormGroup(
      {
        firstName: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
        username: new FormControl(null, [Validators.required]),
        dateOfBirth: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl({value: null, disabled: true}),
        isAdmin: new FormControl(null, [Validators.required]),

      }
    );
  }

  onChangePassword() {
    if (this.form.get('password').enabled) {
      this.form.get('password').disable();
      this.form.patchValue({ 'password': null });
    } else {
      this.form.get('password').enable();
    }
  }

  onCreate() {
    if (this.formShow) {
      this.formShow = false;
      this.form.reset();
    } else {
      this.formShow = true;
      this.mode = 'create';
    }
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.textSearch);
  }

  onSave() {
    let password = this.form.value.password;
    if (typeof(this.form.value.password) === 'undefined') {
      password = '';
    }
    if (this.mode === 'create') {
      this.userService.addUser(this.form.value.email, this.form.value.password, this.form.value.firstName,
      this.form.value.lastName, this.form.value.username, this.dateString(this.form.value.dateOfBirth)).subscribe((response) => {
        console.log(response);
        this.userService.getUsers(this.usersPerPage, this.currentPage, this.textSearch);
        this.formShow = false;
        this.form.reset();
      });
    } else {
      let role = 'user';
      if ( this.form.value.isAdmin) {
        role = 'admin';
      }
      this.userService.updateUser( this.userId,
        this.form.value.email, this.form.value.password, this.form.value.firstName,
      this.form.value.lastName, this.form.value.username, this.dateString(this.form.value.dateOfBirth), role).subscribe((response) => {
        console.log(response);
        this.userService.getUsers(this.usersPerPage, this.currentPage, this.textSearch);
        this.formShow = false;
        this.form.reset();
      });
    }
  }

  onEdit(element) {
    this.formShow = true;
    let isAdmin = false;
    if (element.role === 'admin') {
      isAdmin = true;
    }
    this.userId = element.id;
    this.form.patchValue({
      'name': element.name,
      'firstName': element.firstName,
      'lastName': element.lastName,
      'username': element.username,
      'dateOfBirth': element.dateOfBirth,
      'email': element.email,
      'isAdmin': isAdmin
    });
    this.mode = 'update';
  }

  onDelete(element) {
    this.userService.deleteUser(element.id).subscribe(
      (response) => {
        console.log(response);
        this.userService.getUsers(this.usersPerPage, this.currentPage, this.textSearch);
      }
    );
  }

  onSearch(searchInput) {
    this.textSearch = searchInput.value;
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.textSearch);
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

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
