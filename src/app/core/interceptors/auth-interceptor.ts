import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('tk_id_token');

  if (!token) {
    console.warn('[AuthInterceptor] Aucun token trouvé');
    return next(req);
  }

  console.log('[AuthInterceptor] Token ajouté à la requête :', req.url);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
