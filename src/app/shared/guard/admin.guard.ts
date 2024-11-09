import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  if(accountService.role()?.includes('ADMIN') || accountService.role()?.includes('MODERATOR')) {
    return true;
  } else {
    toastr.error('Bạn không thể truy cập vào đường dẫn này');
    return false;
  }
};
