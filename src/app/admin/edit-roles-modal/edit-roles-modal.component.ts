import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-roles-modal',
  templateUrl: './edit-roles-modal.component.html',
  styleUrl: './edit-roles-modal.component.scss'
})
export class EditRolesModalComponent {
  bsModalRef = inject(BsModalRef);

  username = '';
  title = '';
  availableRoles: string[] = [];
  selectedRoles: string[] = [];
  rolesUpdate = false;

  updateChecked(checkedValue: string) {
    if(this.selectedRoles.includes(checkedValue)) {
      this.selectedRoles = this.selectedRoles.filter(r => r !== checkedValue);
    } else {
      this.selectedRoles.push(checkedValue);
    }
  }

  onSelectRole() {
    this.rolesUpdate = true;
    this.bsModalRef.hide();
  }
}
