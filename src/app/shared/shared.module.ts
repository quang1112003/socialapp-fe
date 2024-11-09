import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './erors/not-found/not-found.component';
import { ValidationMessageComponent } from './erors/validation-message/validation-message.component';
import { NotificationComponent } from './modals/notification/notification.component';
import { AutoFocusDirective } from './auto-focus.directive';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { ServerErrorComponent } from './erors/server-error/server-error.component';
import { TestErrorComponent } from './erors/test-error/test-error.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModule } from 'ng2-file-upload';
import { TextInputComponent } from './forms/text-input/text-input.component';
import { DatePickerComponent } from './forms/date-picker/date-picker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimeagoModule } from "ngx-timeago";
import { HasRoleDirective } from './has-role.directive';
import { ImagePreviewModalComponent } from './modals/image-preview-modal/image-preview-modal.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessageComponent,
    AutoFocusDirective,
    NotificationComponent,
    ServerErrorComponent,
    TestErrorComponent,
    TextInputComponent,
    DatePickerComponent,
    HasRoleDirective,
    ImagePreviewModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      preventDuplicates: true,
    }),
    TabsModule.forRoot(),
    FileUploadModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    ButtonsModule.forRoot(),
    TimeagoModule.forRoot(),
  ],
  exports: [
    RouterModule,
    AutoFocusDirective,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessageComponent,
    TabsModule,
    FileUploadModule,
    TextInputComponent,
    BsDatepickerModule,
    DatePickerComponent,
    PaginationModule,
    FormsModule,
    ButtonsModule,
    TimeagoModule,
    HasRoleDirective,
    ImagePreviewModalComponent,
  ]
})
export class SharedModule { }
