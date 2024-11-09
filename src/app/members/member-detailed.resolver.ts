import { ResolveFn } from '@angular/router';
import { Member } from '../shared/models/user/member.model';
import { inject } from '@angular/core';
import { MemberService } from './member.service';

export const memberDetailedResolver: ResolveFn<Member | null> = (route, state) => {
  const memberService = inject(MemberService);
  
  const username = route.paramMap.get('username');
  
  if(!username) return null;

  return memberService.getMember(username);
};
