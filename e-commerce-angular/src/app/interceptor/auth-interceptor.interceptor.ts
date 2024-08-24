import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Add JWT token to the request header
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`,
                },
              });
              return next.handle(request);
            }),
            catchError((err) => {
              this.authService.logout();
              return throwError(err);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );

  }
}
