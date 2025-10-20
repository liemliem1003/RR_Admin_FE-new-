import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);

      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      if (error.status === 403) {
        router.navigate(['/forbidden']);
      }

      return throwError(() => error);
    })
  );
};
