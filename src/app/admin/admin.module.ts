import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { PhotoManagerComponent } from './photo-manager/photo-manager.component';
import { EditRolesModalComponent } from './edit-roles-modal/edit-roles-modal.component';



@NgModule({
  declarations: [
    AdminPanelComponent,
    UserManagerComponent,
    PhotoManagerComponent,
    EditRolesModalComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
