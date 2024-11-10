import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MemberService } from '../member.service';
import { Member } from '../../shared/models/user/member.model';
import { PostResponse, PostStatus } from '../../shared/models/user/post-response.model';
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { AccountService } from '../../account/account.service';
import { TimeagoModule } from 'ngx-timeago';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { EditPostMemberComponent } from '../edit-post-member/edit-post-member.component';
import { SharedService } from '../../shared/shared.service';
import { LIGHTBOX_CONFIG, LightboxModule } from 'ng-gallery/lightbox';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-list-post-member',
  templateUrl: './list-post-member.component.html',
  styleUrls: ['./list-post-member.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GalleryModule,
    TimeagoModule,
    ModalModule,
    LightboxModule
  ],
  providers: [
    {
      provide: LIGHTBOX_CONFIG,
      useValue: {
        keyboardShortcuts: false,
        exitAnimationTime: 1000,
      }
    }
  ]
})
export class ListPostMemberComponent implements OnInit, OnDestroy {
  private memberService = inject(MemberService);
  public accountService = inject(AccountService);
  private modalService = inject(BsModalService);
  private sharedService = inject(SharedService);
  private toastr = inject(ToastrService);
  bsModalRef?: BsModalRef;
  @Input() photoTab: any;

  listPostMember: PostResponse[] = []; // Always initialized to an empty array
  @Input() member!: Member | null;

  imageUrl: string = '';
  knowsAs: string = '';
  isLoading: boolean = true;

  imagesByPost = new Map<number, GalleryItem[]>();

  @Output() postAdded = new EventEmitter<any>();

  private gallery = inject(Gallery);

  currentImageIndex: { [key: number]: number } = {};
  isLightboxOpen = false;
  currentLightboxImage: any = null;

  readonly PostStatus = PostStatus; // Make enum available to template

  private loadingPosts = false; // Add this flag

  ngOnInit(): void {
    this.getPostByMember();
  }

  getPostByMember() {
    if (this.loadingPosts) {
      return;
    }
    this.loadingPosts = true;
    this.getVisiblePosts();
    this.loadingPosts = false;
  }

  getVisiblePosts(): void {
    const memberId = this.member?.id || this.accountService.user$()!.id;
    this.isLoading = true; // Show loading state
    
    this.memberService.getPostId(memberId).subscribe({
      next: (posts: PostResponse[]) => {
        this.listPostMember = posts;
        
        // Initialize galleries for new posts
        if (this.listPostMember && this.listPostMember.length > 0) {
          this.listPostMember.forEach(post => {
            this.currentImageIndex[post.id] = 0;
            if (post.photos && post.photos.length > 0) {
              const galleryItems = post.photos.map(photo => 
                new ImageItem({ src: photo.url, thumb: photo.url })
              );
              this.imagesByPost.set(post.id, galleryItems);
              setTimeout(() => {
                this.initGallery(post.id);
              }, 0);
            }
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.isLoading = false;
        this.toastr.error('Failed to load posts');
      }
    });
  }

  initGallery(postId: number) {
    const items = this.imagesByPost.get(postId);
    if (items) {
      const galleryRef = this.gallery.ref('gallery-' + postId);
      galleryRef.load(items);
    }
  }

  onGalleryInit(postId: number) {
    this.initGallery(postId);
  }

  deletePost(postId: number): void {
    this.sharedService.showNotification(
      false,
      'Confirm',
      'Are you sure you want to delete this post? All associated images will also be deleted.'
    ).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.memberService.deletePost(postId).subscribe({
          next: (response: any) => {
            this.listPostMember = this.listPostMember.filter(post => post.id !== postId);
            this.toastr.success(response.message || 'Post deleted successfully');
          },
          error: (error) => {
            this.toastr.error(error.error.message || 'Failed to delete post');
          }
        });
      }
    });
  }

  openEditPostModal(post: PostResponse): void {
    const initialState = {
      post: post
    };
    this.bsModalRef = this.modalService.show(EditPostMemberComponent, {
      class: 'modal-dialog-centered modal-lg',
      initialState: initialState
    });

    this.bsModalRef.content.postUpdated.subscribe((updatedPost: PostResponse) => {
      const index = this.listPostMember.findIndex(p => p.id === updatedPost.id);
      if (index !== -1) {
        this.listPostMember[index] = updatedPost;
      }
    });
  }

  getPhotoMainCurrentUser() {
    this.imageUrl = this.accountService.user$()!.photoUrl;
    return this.imageUrl;
  }

  getKnowAsCurrentUser() {
    this.knowsAs = this.accountService.user$()!.knowAs;
    return this.knowsAs;
  }

  onPostSubmitted() {
    this.postAdded.emit();
    // Refresh posts immediately after submission
    this.getVisiblePosts();
  }

  prevImage(postId: number) {
    if (this.currentImageIndex[postId] > 0) {
      this.currentImageIndex[postId]--;
    }
  }

  nextImage(postId: number) {
    const post = this.listPostMember.find(p => p.id === postId);
    if (post && this.currentImageIndex[postId] < post.photos.length - 1) {
      this.currentImageIndex[postId]++;
    }
  }

  setCurrentImage(postId: number, index: number) {
    this.currentImageIndex[postId] = index;
  }

  openLightbox(postId: number, imageIndex: number) {
    const post = this.listPostMember.find(p => p.id === postId);
    if (post && post.photos[imageIndex]) {
      this.currentLightboxImage = post.photos[imageIndex];
      this.isLightboxOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    this.currentLightboxImage = null;
    document.body.style.overflow = 'auto';
  }

  canViewPost(post: PostResponse): Observable<boolean> {
    const currentUserId = this.accountService.user$()?.id;
    
    // Cache the result for each post
    if (!this.visibilityCache.has(post.id)) {
        const visibility$ = this.calculateVisibility(post, currentUserId);
        this.visibilityCache.set(post.id, visibility$);
    }
    
    return this.visibilityCache.get(post.id)!;
  }

  private visibilityCache = new Map<number, Observable<boolean>>();

  private calculateVisibility(post: PostResponse, currentUserId: string | undefined): Observable<boolean> {
    // If it's the user's own post
    if (post.user.id === currentUserId) {
        return of(true);
    }

    // If post is public
    if (post.status === PostStatus.PUBLIC) {
        return of(true);
    }

    // If post is private, only owner can see
    if (post.status === PostStatus.PRIVATE) {
        return of(post.user.id === currentUserId);
    }

    // If post is for friends, check friendship status
    if (post.status === PostStatus.FRIENDS) {
        return this.memberService.areFriends(currentUserId!, post.user.id).pipe(
            tap(areFriends => console.log('Friendship check result:', areFriends))
        );
    }

    return of(false);
  }

  // Clear cache when component is destroyed
  ngOnDestroy() {
    this.visibilityCache.clear();
  }
}
