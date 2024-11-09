import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../shared.service';


export const authorizationGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const sharedService = inject(SharedService);
  const router = inject(Router);

  const user = accountService.user$();

  if (user) {
    return true;
  } else {
    sharedService.showNotification(false, 'Thông báo', 'Hãy đăng nhập trước khi truy cập vào đường dẫn này');
    router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
