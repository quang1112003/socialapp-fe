import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PostResponse } from '../../shared/models/user/post-response.model';
import { MemberService } from '../member.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-post-member',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Edit Post</h4>
      <button type="button" class="btn-close" (click)="bsModalRef.hide()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="editForm" (ngSubmit)="updatePost()">
        <div class="form-group">
          <textarea 
            class="form-control" 
            formControlName="content" 
            rows="4"
            placeholder="What's on your mind?">
          </textarea>
        </div>
        <div class="mt-3 text-end">
          <button type="button" class="btn btn-secondary me-2" (click)="bsModalRef.hide()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="!editForm.valid">Save Changes</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border: none;
      border-radius: 12px 12px 0 0;
      padding: 1rem 1.5rem;
    }
    .modal-title {
      font-weight: 600;
      letter-spacing: 0;
    }
    .btn-close {
      color: white;
      opacity: 0.8;
      transition: all 0.3s ease;
      &:hover {
        opacity: 1;
        transform: rotate(90deg);
      }
    }
    .modal-body {
      padding: 1.5rem;
    }
    textarea {
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      padding: 12px;
      resize: none;
      font-size: 1rem;
      transition: all 0.3s ease;
      &:focus {
        border-color: #8b5cf6;
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        outline: none;
      }
    }
    .btn {
      padding: 0.5rem 1.5rem;
      border-radius: 10px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border: none;
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
      }
      &:disabled {
        opacity: 0.6;
      }
    }
    .btn-secondary {
      background: #f1f5f9;
      border: none;
      color: #64748b;
      &:hover {
        background: #e2e8f0;
        color: #475569;
      }
    }
  `]
})
export class EditPostMemberComponent implements OnInit {
  editForm!: FormGroup;
  post!: PostResponse;
  @Output() postUpdated = new EventEmitter<PostResponse>();

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private memberService: MemberService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      content: [this.post.content, Validators.required]
    });
  }

  updatePost() {
    if (this.editForm.valid) {
      const postId = this.post.id;
      const postRequest = {
        content: this.editForm.get('content')?.value
      };

      this.memberService.updatePost(postId, postRequest).subscribe({
        next: (updatedPost) => {
          this.postUpdated.emit(updatedPost);
          this.toastr.success('Post updated successfully');
          this.bsModalRef.hide();
        },
        error: (error) => {
          this.toastr.error(error.error.message || 'Failed to update post');
        }
      });
    }
  }
}
