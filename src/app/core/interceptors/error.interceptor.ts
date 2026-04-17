import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

const messageByStatus = (error: HttpErrorResponse): string => {
  const backendMessage =
    typeof error.error === 'object' && error.error && 'message' in error.error
      ? String(error.error.message)
      : null;

  if (backendMessage) {
    return backendMessage;
  }

  switch (error.status) {
    case 0:
      return 'Não foi possível conectar à API.';
    case 400:
      return 'Requisição inválida. Revise os dados informados.';
    case 404:
      return 'Recurso não encontrado.';
    case 500:
      return 'Erro interno no servidor. Tente novamente mais tarde.';
    default:
      return 'Ocorreu um erro inesperado.';
  }
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        snackBar.open(messageByStatus(error), 'Fechar', { duration: 5000 });
      }
      return throwError(() => error);
    })
  );
};
