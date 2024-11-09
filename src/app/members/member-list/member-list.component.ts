import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit {
  memberService = inject(MemberService);
  accountService = inject(AccountService);

  genderList = [
    {value: 'male', display: 'Male'},
    {value: 'female', display: 'Female'},
  ];

  ngOnInit(): void {
    if(!this.memberService.paginatedResult()) {
      this.loadMember();
    }
  }

  loadMember() {
    this.memberService.memberCache.clear();
    this.memberService.userParams().pageNumber = 1;
    this.memberService.loadMembers();
  }

  resetFilter() {
    this.memberService.resetUserParams();
    this.loadMember();
  }

  pageChanged(event: PageChangedEvent) {
    if(this.memberService.userParams().pageNumber !== event.page) {
      this.memberService.userParams().pageNumber = event.page;
      this.loadMember();
    }
  }
}
