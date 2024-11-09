import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NotificationComponent } from './modals/notification/notification.component';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  busyRequestCount = 0;
  bsModalRef?: BsModalRef;
  api = environment.appUrl;

  private http = inject(HttpClient);
  private modalService = inject(BsModalService);
  private snipperService = inject(NgxSpinnerService);

  showNotification(isSuccess: boolean, title: string, message: string): Observable<boolean> {
    const initialState: ModalOptions = {
      initialState: {
        isSuccess,
        title,
        message,
      }
    };

    this.bsModalRef = this.modalService.show(NotificationComponent, initialState);
    return (this.bsModalRef.content as NotificationComponent).confirmationSubject.asObservable();
  }



  busy() {
    this.busyRequestCount++;
    console.log(this.busyRequestCount);

    this.snipperService.show(undefined, {
      type: 'ball-clip-rotate',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
    });
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.snipperService.hide();
    }
  }

  get401Error() {
    return this.http.get(`${this.api}/buggy/auth`);
  }

  get400Error() {
    return this.http.get(`${this.api}/buggy/bad-request`);
  }

  get500Error() {
    return this.http.get(`${this.api}/buggy/server-error`);
  }

  get404Error() {
    return this.http.get(`${this.api}/buggy/not-found`);
  }

}
