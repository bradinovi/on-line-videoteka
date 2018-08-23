import { Component, OnInit } from '@angular/core';
import { AuthService } from './userauth/userauth.service';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public toastConfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    animation: 'fade'
  });
  constructor (private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
