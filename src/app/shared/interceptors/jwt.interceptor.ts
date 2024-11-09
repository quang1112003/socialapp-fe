import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../../account/account.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  const user = accountService.user$();

  const shouldBypass = req.url.includes('http://localhost:8080/messages');

   if (shouldBypass) {
     return next(req);
   }

  if (user) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.jwt}`,
      },
    });
  }

  return next(req);
};