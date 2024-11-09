import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];

              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              throw modalStateErrors.flat(); // "làm phẳng" mảng đa chiều thành một mảng phẳng
            } else {
              toastr.error(error.error, error.status);
            }
            break;
          case 401:
            // toastr.error('Không được phép truy cập vào đường dẫn này', error.status);
            break;

          case 404:
            router.navigateByUrl('/not-found');
            break;

          case 500:
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', navigationExtras);

            break;

          default:
            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
                // Lỗi phía client
                errorMsg = `Error: ${error.error.message}`;
            } else {
                // Lỗi phía server
                if (error.status === 200 && error.url) {
                    // Kiểm tra nếu phản hồi không phải là JSON
                    if (typeof error.error === 'string') {
                        errorMsg = `Server responded with a string: ${error.error}`;
                    } else {
                        errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    }
                } else {
                    errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
            }
            console.error(errorMsg);
            return throwError(() => error);
        }
      }

      throw error;
    }),
  );
};
