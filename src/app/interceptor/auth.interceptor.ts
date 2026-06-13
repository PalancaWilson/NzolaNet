import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const token = auth.token();

  // Clonar o pedido e adicionar o cabeçalho de autorização se o token existir
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token expirado ou inválido — forçar logout
      if (err.status === 401) {
        auth.terminarSessao();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};