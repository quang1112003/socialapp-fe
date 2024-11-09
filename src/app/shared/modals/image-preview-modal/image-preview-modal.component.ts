import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-image-preview-modal',
  templateUrl: './image-preview-modal.component.html',
  styleUrl: './image-preview-modal.component.scss'
})
export class ImagePreviewModalComponent {
  imageSrc!: string;

  constructor(public bsModalRef: BsModalRef) {}

  close(): void {
    this.bsModalRef.hide();
  }
}
