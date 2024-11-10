import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MemberService } from '../member.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Member } from '../../shared/models/user/member.model';
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { Photo } from '../../shared/models/user/photo.model';
import { LIGHTBOX_CONFIG, LightboxConfig, LightboxModule } from 'ng-gallery/lightbox';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../../shared/models/message/message.model';
import { Friendships, FriendshipStatus } from '../../shared/models/user/friendships.model';
import { ListPostMemberComponent } from '../list-post-member/list-post-member.component';
import { PostStatus } from '../../shared/models/user/post-response.model';
import { AccountService } from '../../account/account.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TimeagoModule,
    GalleryModule,
    LightboxModule,
    ListPostMemberComponent,
    TabsModule
  ],
  providers: [
    {
      provide: LIGHTBOX_CONFIG,
      useValue: {
        keyboardShortcuts: false,
        exitAnimationTime: 1000,
      } as LightboxConfig
    }
  ]
})
export class MemberDetailsComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs?: TabDirective;
  galleryId = 'memberGallery';
  images: GalleryItem[] = [];
  message: Message[] = [];

  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private gallery = inject(Gallery);
  public FriendshipStatus = FriendshipStatus;
  private accountService = inject(AccountService);
  filteredImages: GalleryItem[] = [];

  member!: Member;
  friendshipStatus: FriendshipStatus | null = null;

  constructor() {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.loadVisiblePhotos();
  
        this.memberService.getFriendshipStatus(this.member.id).subscribe({
          next: (status: Friendships) => {
            if (status !== null) {
              this.friendshipStatus = status.status;
            }
          },
          error: () => {
            console.error('Failed to get friendship status');
          }
        });
      }
    });
  }

  private loadVisiblePhotos() {
    const currentUserId = this.accountService.user$()?.id;
    const isOwnProfile = currentUserId === this.member.id;

    // If it's the user's own profile, show all photos
    if (isOwnProfile) {
      this.loadImages(this.member.photos);
      return;
    }

    // Get all visible posts for the member
    this.memberService.getPostId(this.member.id).subscribe({
      next: (posts) => {
        // Get photos only from visible posts
        const visiblePhotos: Photo[] = [];

        // Always include the main photo
        const mainPhoto = this.member.photos?.find(p => p.isMain);
        if (mainPhoto) {
          visiblePhotos.push(mainPhoto);
        }

        // Add photos from visible posts
        posts.forEach(post => {
          // Only include photos if the post is visible
          if (post.photos && post.photos.length > 0) {
            switch (post.status) {
              case PostStatus.PUBLIC:
                visiblePhotos.push(...post.photos);
                break;
              case PostStatus.FRIENDS:
                if (this.friendshipStatus === FriendshipStatus.ACCEPTED) {
                  visiblePhotos.push(...post.photos);
                }
                break;
              case PostStatus.PRIVATE:
                // Private photos are only visible to the owner, which is handled by isOwnProfile check above
                break;
            }
          }
        });

        // Remove duplicates based on photo ID
        const uniquePhotos = Array.from(
          new Map(visiblePhotos.map(photo => [photo.id, photo])).values()
        );

        this.loadImages(uniquePhotos);
      },
      error: (error) => {
        console.error('Error loading visible photos:', error);
        // If there's an error, just show the main photo
        const mainPhoto = this.member.photos?.find(p => p.isMain);
        this.loadImages(mainPhoto ? [mainPhoto] : []);
      }
    });
  }

  loadImages(photos: Photo[] | null | undefined) {
    if (photos && photos.length > 0) {
      this.images = photos.map(photo => new ImageItem({ src: photo.url, thumb: photo.url }));
      const galleryRef = this.gallery.ref(this.galleryId);
      galleryRef.load(this.images);
    } else {
      this.images = [];
    }
  }

  capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onPostAdded(event: any) {
    this.memberService.getMember(this.member.email).subscribe({
      next: updatedMember => {
        this.member = updatedMember;
      }
    });
  }
}
