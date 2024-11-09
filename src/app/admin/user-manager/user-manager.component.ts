import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { User } from '../../shared/models/account/user.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EditRolesModalComponent } from '../edit-roles-modal/edit-roles-modal.component';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.scss'
})
export class UserManagerComponent implements OnInit{
  private adminService = inject(AdminService);
  private bsModalService = inject(BsModalService);

  bsModalRef: BsModalRef<EditRolesModalComponent> = new 
  BsModalRef<EditRolesModalComponent>();

  users: User[] = [];

  ngOnInit(): void {
    this.getUserRoles();
  }

  openRoleModal(user: User) {
    const initState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'Quyền người dùng',
        username: user.email,
        selectedRoles: [...user.roles],
        availableRoles: ['ADMIN','MODERATOR','MEMBER'],
        users: this.users,
        rolesUpdate: false,
      },
    }

    this.bsModalRef = this.bsModalService.show(EditRolesModalComponent, initState);
    this.bsModalRef.onHidden?.subscribe({
      next: () => {
        if(this.bsModalRef.content && this.bsModalRef.content.rolesUpdate) {
          const selectedRoles = this.bsModalRef.content.selectedRoles;
          this.adminService.updateUserRoles(user.email,selectedRoles).subscribe({
            next: (roles: string[]) => {
              user.roles = roles;
            },
          });
        }
      },
    })
  }

  getUserRoles() {
    this.adminService.getUserRoles().subscribe({
      next: (response: User[]) => {
        this.users = response;
      },
    });
  }
  
}
