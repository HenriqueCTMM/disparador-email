import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//.test(req.url)) {
    return next(req);
  }

  const normalizedBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = req.url.startsWith('/') ? req.url : `/${req.url}`;
  const apiReq = req.clone({ url: `${normalizedBaseUrl}${normalizedPath}` });

  return next(apiReq);
};
