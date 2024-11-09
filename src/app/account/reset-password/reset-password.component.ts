import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { SharedService } from '../../shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../shared/models/account/user.model';
import { ResetPassword } from '../../shared/models/account/reset-password.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token!: string;
  email!: string;
  submitted = false;
  errorMessages: string[] = [];

  private accountService = inject(AccountService);
  private sharedService = inject(SharedService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {

    const user = this.accountService.user$();

    if (user) {
      this.router.navigate(['/members/member-lists']);
    } else {
      this.activatedRoute.queryParamMap.subscribe({
        next: (params: ParamMap) => {
          this.token = params.get('token') || '';
          this.email = params.get('email') || '';

          if (this.token && this.email) {
            this.initializeForm(this.email);
          } else {
            this.router.navigateByUrl('/account/login');
          }
        },
      });
    }

  }

  initializeForm(username: string) {
    this.resetPasswordForm = this.formBuilder.group({
      email: [{ value: username, disabled: true }],
      newPassword: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(6)]]
    });
  }

  resetPassword() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.resetPasswordForm.valid && this.email && this.token) {
      const model: ResetPassword = {
        email: this.email,
        token: this.token,
        newPassword: this.resetPasswordForm.get('newPassword')!.value,
      };

      this.accountService.resetPassword(model).subscribe({
        next: (response: any) => {
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.router.navigateByUrl('/account/login');
        },
        error: (error) => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          }
          else {
            this.errorMessages.push(error.error);
          }
        },
      });
    }
  }

  cancel() {
    this.router.navigateByUrl('/account/login');
  }
}
