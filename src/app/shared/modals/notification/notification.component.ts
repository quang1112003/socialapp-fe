import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  isSuccess: boolean = false;
  title: string = '';
  message: string = '';
  confirmationSubject: Subject<boolean> = new Subject();

  constructor(public bsModalRef: BsModalRef) { }

  confirm(): void {
    this.confirmationSubject.next(true); 
    this.confirmationSubject.complete();  
    this.bsModalRef?.hide();  
  }

  cancel(): void {
    this.confirmationSubject.next(false);  
    this.confirmationSubject.complete();  
    this.bsModalRef?.hide();  
  }
}
