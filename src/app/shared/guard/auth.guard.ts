// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AccountService } from '../../account/account.service';
// import { catchError, map, of } from 'rxjs';
// import { User } from '../models/account/user.model';

// export const authGuard: CanActivateFn = (route, state) => {
//   const accountService = inject(AccountService);  
//   const router = inject(Router);

//   const jwt = accountService.getJWT();

//   if(jwt) {
//     return accountService.refreshUser(jwt).pipe(
//       map((user: User | null) => {
//         if (user) {
//           return true;  // Cho phép truy cập route
//         } else {
//           router.navigate(['/login']);
//           return false;
//         }
//       }),
//       catchError(() => {
//         accountService.logout();
//         router.navigate(['/login']);
//         return of(false);
//       })
//     );
//   }

//    router.navigate(['/login']);
//   return false;
// };
