import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status >= 500) {
        console.error('Erro no servidor:', err.status, err.message);
      } else if (err.status === 0) {
        console.error('Erro de rede — servidor indisponível');
      }
      return throwError(() => err);
    })
  );
};
