import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const router = inject(Router);

  let authReq = req;


  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
  }
  return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Session expired or invalid token');
          localStorage.removeItem('access_token'); 
          router.navigate(['/login']); 
        }
        return throwError(() => error);
      })
    );
};