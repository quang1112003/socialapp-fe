import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { AccountService } from '../../account/account.service';
import { MemberService } from '../member.service';
import { User } from '../../shared/models/account/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MemberUpdateDto } from '../../shared/models/user/member-update.model';
import { Interest } from '../../shared/models/user/interest.model';
import { TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss',
})
export class MemberEditComponent implements OnInit {
  member!: Member;
  editForm!: FormGroup;
  interest: Interest[] = [];
  selectedInterests: number[] = [];
  @ViewChild('photoTab', { static: true }) photoTab?: TabDirective;

  selectedCountryIso = signal<string | null>(null);
  selectedStateIso = signal<string | null>(null);

  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private toasrt = inject(ToastrService);
  private formBuilder = inject(FormBuilder);

  // Sử dụng service để truy xuất dữ liệu
  countries$ = this.memberService.getCountries;
  states$ = this.memberService.getStates;
  cities$ = this.memberService.getCities;

  ngOnInit(): void {
    this.initializeForm();
    this.memberService.fetchCountries();
    this.loadInterest();
    this.loadMember();
  }

  

  onCountryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const countryId = +target.value;
    
    const selectedCountry = this.countries$().find(country => country.id === countryId);
    if (selectedCountry) {
      this.editForm.patchValue({ countryId });
      this.selectedCountryIso.set(selectedCountry.iso2);
      this.memberService.fetchStates(selectedCountry.iso2); 
      this.selectedStateIso.set(null);
      this.memberService.clearCities();
    }
  }

  onStateChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const stateId = +target.value;
    const selectedState = this.states$().find(state => state.id === stateId);
  
    const countryIso = this.selectedCountryIso();
    if (countryIso && selectedState) {
      this.editForm.patchValue({ stateId });
      this.selectedStateIso.set(selectedState.iso2);
      this.memberService.fetchCities(countryIso, selectedState.iso2); 
    }
  }

  onCityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const cityId = +target.value;
    this.editForm.patchValue({ cityId });
  }

  initializeForm() {
    this.editForm = this.formBuilder.group({
      introduction: [''],
      lookingFor: [''],
      interests: [[]],
      countryId: [null],
      stateId: [null],
      cityId: [null],
      isPrivate: [false],
    });
  }

  loadInterest() {
    this.memberService.getInterest().subscribe({
      next: (interest: Interest[]) => {
        this.interest = interest;
      }
    });
  }

  loadMember() {
    const user = this.accountService.getCurrentUser();
    if (!user) return;

    this.memberService.getMember(user.email).subscribe({
      next: (response: Member) => {
        this.member = response;
        this.selectedInterests = this.member.interests.map(i => i.id); 
        if (this.editForm) {
          this.editForm.patchValue(this.member); 
        }
      },
    });
  }

  updateMember() {
    if (this.editForm.valid) {
      const memberUpdateDto: MemberUpdateDto = {
        ...this.editForm.value,
        interests: this.selectedInterests 
      };
      
      console.log('form value', this.editForm.value);
      
      this.memberService.updateMember(memberUpdateDto).subscribe({
        next: (_) => {
          this.toasrt.success('Cập nhật thành công');
          this.editForm.markAsPristine();
        },
      });
    }
  }

  toggleInterestSelection(interestId: number) {
    if (this.selectedInterests.includes(interestId)) {
      this.selectedInterests = this.selectedInterests.filter(id => id !== interestId);
    } else {
      this.selectedInterests.push(interestId);
    }

    this.editForm.get('interests')?.setValue(this.selectedInterests);
    this.editForm.markAsDirty();
  }  
  

  onMemberChange(event: Member) {
    this.member = event;
  }
}
