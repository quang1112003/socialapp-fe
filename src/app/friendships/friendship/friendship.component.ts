import { Component, OnDestroy, OnInit } from '@angular/core';
import { Friendships, FriendshipStatus } from '../../shared/models/user/friendships.model';
import { FriendshipService } from '../friendship.service';
import { AccountService } from '../../account/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friendship',
  templateUrl: './friendship.component.html',
  styleUrl: './friendship.component.scss'
})
export class FriendshipComponent implements OnInit {
  friendRequests: Friendships[] = [];
  invitationsSent: Friendships[] = [];
  selectedTab: string = 'requests';
  private friendRequestSubscription!: Subscription;

  constructor(private friendshipService: FriendshipService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loadFriendRequests();
  }

  loadFriendRequests() {
    this.friendshipService.getFriendships(FriendshipStatus.PENDING).subscribe({
      next: (res: Friendships[]) => {
        const currentUserId = this.accountService.getCurrentUser()?.id;
  
        this.friendRequests = res.filter(request => request.friendId === currentUserId 
          && request.userId !== currentUserId);
        
        this.invitationsSent = res.filter(request => request.userId === currentUserId 
          && request.friendId !== currentUserId);
      }
    });
  }

  acceptFriendRequest(friendId: string) {
    this.friendshipService.acceptFriendRequest(friendId).subscribe({
      next: (res) => {
        console.log('Accepted friend request:', res);
        this.loadFriendRequests(); 
      },
      error: (err) => {
        console.error('Error accepting friend request:', err);
      }
    });
  }
  
  cancelInvitation(friendId: string) {
    this.friendshipService.rejectFriendRequest(friendId).subscribe({
      next: (res) => {
        console.log('Rejected friend request:', res);
        this.loadFriendRequests();
      },
      error: (err) => {
        console.error('Error rejecting friend request:', err);
        // Có thể hiển thị thông báo lỗi ở đây
      }
    });
  }
  

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

}
