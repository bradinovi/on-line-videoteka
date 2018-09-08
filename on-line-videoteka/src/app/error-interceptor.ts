import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Toast, ToasterService } from 'angular2-toaster';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {  // works like outgoing middleware

  constructor(private toasterService: ToasterService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured!';
        if (error.error.error) {
          errorMessage = error.error.error;
        }
        const toast: Toast = {
          type: 'Error',
          title: 'Error',
          body: errorMessage,
          showCloseButton: true
        };
        this.toasterService.pop(toast);
        return throwError(error);
      })
    );
  }
}
