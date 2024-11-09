import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { SharedService } from '../../shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss'
})
export class SendEmailComponent implements OnInit {
  emailForm!: FormGroup;
  submitted = false;
  modeMain!: string;
  errorMessage: string[] = [];

  accountService = inject(AccountService);
  sharedService = inject(SharedService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const user = this.accountService.user$();

    if (user) {
      this.router.navigate(['/']);
    } else {
      const mode = this.activatedRoute.snapshot.paramMap.get('mode');

      if (mode) {
        this.modeMain = mode;
        this.initializeForm();
      }
    }
  }

  initializeForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
    });
  }

  sendEmail() {
    this.submitted = true;
    this.errorMessage = [];

    if (this.emailForm.valid && this.modeMain) {
      if (this.modeMain.includes('resend-email-confirmation-link')) {
        this.accountService.resendEmailConfirmLink(this.emailForm.get('email')?.value)
          .subscribe({
            next: (response: any) => {
              this.sharedService.showNotification(true, response.value.title, response.value.message);
              this.router.navigate(['account/login']);
            },
            error: (err) => {
              if (err.error.errors) {
                this.errorMessage = err.error.errors;
              } else {
                this.errorMessage.push(err.error);
              }
            },
          });
      } else if (this.modeMain.includes('forgot-username-or-password')) {
        this.accountService.forgotUsernameOrPassword(this.emailForm.get('email')?.value).subscribe({
          next: (response: any) => {
            this.sharedService.showNotification(true, response.value.title, response.value.message);
            this.router.navigate(['account/login']);
          },
          error: (err) => {
            if (err.error.errors) {
              this.errorMessage = err.error.errors;
            } else {
              this.errorMessage.push(err.error);
            }
          },
        });
      }
    }
  }

  cancel() {
    this.router.navigate(['account/login']);
  }

}
