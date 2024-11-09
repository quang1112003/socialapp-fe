import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { AccountService } from '../../account/account.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment.development';
import { MemberService } from '../member.service';
import { Photo } from '../../shared/models/user/photo.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private toastr = inject(ToastrService);

  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.appUrl;
  memberChange = output<Member>();

  ngOnInit(): void {
    this.initializeUploader();
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: _ => {
        const user = this.accountService.user$();

        if (user) {
          user.photoUrl = photo.url;
          this.accountService.setUser(user);
        }

        const updateMember = { ...this.member() };

        updateMember.photoUrl = photo.url;

        updateMember.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });

        this.memberChange.emit(updateMember);

        this.toastr.success('Đặt ảnh đại diện thành công');
      },
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: _ => {
        console.log('delete photo', photo);
        
        const updateMember = { ...this.member() };
        updateMember.photos = updateMember.photos.filter(x => x.id !== photo.id);
        this.memberChange.emit(updateMember);
        this.toastr.success('Xóa ảnh thành công');
      },
      complete: () => {
        console.log('Delete photo successfully!');
      }
    })
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/users/upload-image',
      authToken: 'Bearer ' + this.accountService.getCurrentUser()?.jwt,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    let totalFiles = 0;
    let uploadedFiles = 0;

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      totalFiles++;
    }

    this.uploader.onSuccessItem = (item, response, status, header) => {
      const photo = JSON.parse(response);
      const updatedMember = { ...this.member() };
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);

      uploadedFiles++;

      // Nếu tất cả các file đều đã tải lên thành công
      if (uploadedFiles === totalFiles) {
        if (totalFiles === 1) {
          this.toastr.success('Thêm ảnh thành công');
        } else {
          this.toastr.success('Thêm tất cả ảnh thành công');
        }

        // Đặt lại sau khi hoàn tất
        totalFiles = 0;
        uploadedFiles = 0;
      }

      if (photo.isMain) {
        const user = this.accountService.getCurrentUser();
        if (user) {
          user.photoUrl = photo.url;
          this.accountService.setUser(user)
        }
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember)
      }

    }
  }
  
}
