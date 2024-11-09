import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, OnInit, Output, EventEmitter } from '@angular/core';
import { MemberService } from '../member.service';
import { Member } from '../../shared/models/user/member.model';
import { PostResponse } from '../../shared/models/user/post-response.model';
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { AccountService } from '../../account/account.service';
import { TimeagoModule } from 'ngx-timeago';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { EditPostMemberComponent } from '../edit-post-member/edit-post-member.component';
import { SharedService } from '../../shared/shared.service';
import { LIGHTBOX_CONFIG, LightboxModule } from 'ng-gallery/lightbox';
import { ToastrService } from 'ngx-toastr';

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
export class ListPostMemberComponent implements OnInit {
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

  ngOnInit(): void {
    this.getPostByMember();
  }

  getPostByMember() {
    const memberId = this.member?.id || this.accountService.user$()!.id;
    this.memberService.getPostId(memberId).subscribe({
      next: (res: PostResponse[]) => {
        this.listPostMember = res || []; // Ensure it's an array
        this.isLoading = false; // Set loading to false once data is fetched
        if (this.listPostMember) {
          this.listPostMember.forEach(post => {
            this.currentImageIndex[post.id] = 0; // Initialize index for each post
            if (post.photos && post.photos.length > 0) {
              const galleryItems = post.photos.map(photo => new ImageItem({ src: photo.url, thumb: photo.url }));
              this.imagesByPost.set(post.id, galleryItems);
              
              // Initialize gallery for each post
              setTimeout(() => {
                this.initGallery(post.id);
              });
            }
          });
        }
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isLoading = false; // Ensure loading is set to false even on error
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
            // Remove the post from the list
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
      // Update the post in the list
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
      document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    }
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    this.currentLightboxImage = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}
