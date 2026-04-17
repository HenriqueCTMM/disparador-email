import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const SHOW_GLOBAL_LOADING = new HttpContextToken<boolean>(() => true);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  if (req.context.get(SHOW_GLOBAL_LOADING) === false) {
    return next(req);
  }

  loadingService.start();
  return next(req).pipe(finalize(() => loadingService.stop()));
};
