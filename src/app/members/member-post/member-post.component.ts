import { CommonModule } from '@angular/common';
import { Component, computed, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MemberService } from '../member.service';
import { AccountService } from '../../account/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export enum PostStatus {
  PUBLIC = 'PUBLIC',
  FRIENDS = 'FRIENDS',
  PRIVATE = 'PRIVATE'
}

@Component({
  selector: 'app-member-post',
  templateUrl: './member-post.component.html',
  styleUrls: ['./member-post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class MemberPostComponent {
  postForm: FormGroup;
  selectedFiles: { file: File, preview: string }[] = [];
  PostStatus = PostStatus;

  currentUser = computed(() => this.accountService.user$());

  @Output() postCreated = new EventEmitter<void>();

  constructor(
    public bsModalRef: BsModalRef,
    private memberService: MemberService,
    public accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.postForm = this.fb.group({
      content: [''],
      status: [PostStatus.PUBLIC]
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        if (this.selectedFiles.length < 5 && file.type.startsWith('image/')) {
          this.createPreview(file);
        }
      }
    }
  }

  createPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedFiles.push({
        file: file,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  submitPost() {
    if (this.postForm.invalid) {
      return;
    }

    const { content, status } = this.postForm.value;
    const files = this.selectedFiles.map(f => f.file);

    this.memberService.createPost({ content, status }, files).subscribe({
      next: (res: any) => {
        if (res.id) {
          localStorage.setItem(`post_${res.id}_status`, status);
        }
        
        this.postForm.reset();
        this.selectedFiles = [];
        this.closeModal();
        this.router.navigate(['/members/edit']);
        this.toastr.success(res.message || 'Post created successfully');
        this.postCreated.emit();
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Failed to create post');
      }
    });
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  getPlaceholder(): string {
    const user = this.currentUser();
    const knowAs = user?.knowAs || '';
    const capitalizedKnowAs = knowAs.charAt(0).toUpperCase() + knowAs.slice(1);
    return `Hey ${capitalizedKnowAs}, what are you thinking?`;
  }
}