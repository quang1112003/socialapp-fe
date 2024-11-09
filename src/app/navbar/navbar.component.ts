import { Component, OnInit, HostListener } from '@angular/core';
import { AccountService } from '../account/account.service';
import { NgIf } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MemberPostComponent } from '../members/member-post/member-post.component';
import { NotificationService } from '../message/Notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  bsModalRef?: BsModalRef;
  unreadMessageCount: number = 0;
  isDropdownOpen = false;

  constructor(
    public accountService: AccountService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadMessageCount = count;
    });
  }

  isAuthPage(): boolean {
    return this.router.url.includes('/account/');
  }

  logout() {
    this.isDropdownOpen = false;
    this.accountService.logout();
  }

  openPostModal(): void {
    this.bsModalRef = this.modalService.show(MemberPostComponent, {
      class: 'modal-dialog-centered modal-lg'
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const userInfo = document.querySelector('.user-info');
    if (userInfo && !userInfo.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }
}
