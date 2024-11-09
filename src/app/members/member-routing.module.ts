import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from '../shared/guard/prevent-unsaved-changes.guard';
import { memberDetailedResolver } from './member-detailed.resolver';
import { MessageComponent } from '../message/message.component';
// import { authGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  { path: 'edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard]},
  { path: 'member-lists', component: MemberListComponent},
  { path: ':username', component: MemberDetailsComponent, resolve: {member: memberDetailedResolver}},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MemberRoutingModule { }
