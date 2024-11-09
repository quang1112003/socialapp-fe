import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { LikeService } from '../like.service';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from '../member.service';
import { Router } from '@angular/router';
import { Friendships, FriendshipStatus } from '../../shared/models/user/friendships.model';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent implements OnInit {
  private likeService = inject(LikeService);
  private memberService = inject(MemberService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  friendshipStatus = signal<string>('');

  isHover = false;

  member = input.required<Member>(); // ds members

  hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));

  constructor() {

  }

  ngOnInit(): void {
    this.getFriendshipStatus();
  }

  // Lấy trạng thái kết bạn
  getFriendshipStatus() {
    this.memberService.getFriendshipStatus(this.member().id).subscribe({
      next: (status: Friendships) => {
        this.friendshipStatus.set(status ? status.status : FriendshipStatus.UNFRIENDED); // Gán trạng thái
      },
      error: () => {
        this.toastr.error('Failed to get friendship status');
      }
    });
  }

  // Hàm điều hướng tới trang tin nhắn
  navigateToMessage() {
    this.memberService.setRecipientName(this.member().knowAs);  // Set recipient name
    this.router.navigate(['/message']);  // Navigate to messages
  }

  toggleLike() {
    this.likeService.toggleLike(this.member().id).subscribe({
      next: _ => {

        if (this.hasLiked()) {
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member().id)); // bỏ
          this.toastr.success(`You have successfully unliked ${this.member().knowAs}!`);
        }
        else {
          this.likeService.likeIds.update(ids => [...ids, this.member().id]); // thả
          this.toastr.success(`You have added ${this.member().knowAs} to your favorites list ❤️`);
        }
      },
    })
  }

   // Toggle friend request
   toggleFriendRequest() {
    this.memberService.toggleFriendRequest(this.member().id).subscribe({
      next: (updatedFriendship: Friendships) => {
        // Cập nhật lại trạng thái sau khi gửi yêu cầu kết bạn
        this.friendshipStatus.set(updatedFriendship.status);
        
        console.log('friendshipStatus',this.friendshipStatus());
        const message = updatedFriendship.status === FriendshipStatus.PENDING 
          ? `You have sent a friend request to ${this.member().knowAs}.` 
          : `You are no longer friends with ${this.member().knowAs}.`;
        this.toastr.success(message);
      },
      error: () => {
        this.toastr.error('Failed to toggle friend request');
      }
    });
  }

  hasLike(): boolean {
    return true;
  }

}
