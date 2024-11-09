import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Country } from '../../shared/models/user/country.model';
import { City } from '../../shared/models/user/city.model';
import { State } from '../../shared/models/user/state.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage: string[] = [];
  maxDate = new Date();
  listCountry!: Country[]
  countrySelected!: string;
  listState!: State[]
  selectedState!: string
  listCity!: City[]


  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private toastr: ToastrService,
  ) {

    const user = accountService.user$();

    if (user) {
      this.router.navigate(['/members/member-lists']);
    }

  }
  
  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    // this.fetchCountry();
    // this.onCountrySelected(); 
    // this.onStateSelected();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['',[Validators.required, Validators.minLength(2),Validators.maxLength(15)]],
      lastName: ['',[Validators.required, Validators.minLength(2),Validators.maxLength(15)]],
      knowAs: ['',[Validators.required, Validators.maxLength(20)]],
      email: ['',[Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      dateOfBirth: ['', Validators.required],
      gender: ['male'],
      country: [''],
      state: [''],
      city: [''],
      pass: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(15)]],
      confirmPassword: ['',[Validators.required, this.matchValues('pass')]],
    });

    this.registerForm.controls['pass'].valueChanges.subscribe({
      next: _ => this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  // private fetchCountry(){
  //   this.accountService.getCountries().subscribe({
  //     next: (response: Country[]) => {
  //       console.log('country', response);
        
  //       this.listCountry = response;
  //     }
  //   })
  
  // }

  // onCountrySelected() {
  //   this.registerForm.get('country')?.valueChanges.subscribe(countryIso => {
  //     this.accountService.getStateOfSelectedCountry(countryIso).subscribe({
  //       next: (response: State[]) => {
  //         console.log('state', response);
          
  //         this.listState = response;
  //         this.registerForm.get('state')?.reset(); // Reset state and city when country changes
  //         this.listCity = [];
  //       }
  //     });
  //   });
  // }

  // onStateSelected() {
  //   this.registerForm.get('state')?.valueChanges.subscribe(state => {
  //     const country = this.registerForm.get('country')?.value;
  //     if (country && state) {
  //       this.accountService.getCitiesOfSelectedState(country, state).subscribe({
  //         next: (response: City[]) => {
  //           console.log('city', response);
            
  //           this.listCity = response;
  //           this.registerForm.get('city')?.reset(); 
  //         }
  //       });
  //     }
  //   });
  // }

  matchValues(mathTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(mathTo)?.value ? null : {isMatching: true};
    }
  }

  register() {
    this.submitted = true;
    this.errorMessage = [];

    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({dateOfBirth: dob});
    
    if(this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.sharedService.showNotification(true, response.title, response.message);
          this.router.navigateByUrl('/account/login');
        },
        error: (error) => {
          if(error.error.errors) {
            this.errorMessage = error.error.errors;
            this.toastr.error(error.error.errors);
          } 
          else {
            this.errorMessage.push(error.error);
            this.toastr.error(error.error);
          }
        },
        complete: () => {
          // this.toastr.success('Đăng ký thành công, hãy xác nhận email trước khi đăng nhập!')
        }
      });
    }
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  } 

}
