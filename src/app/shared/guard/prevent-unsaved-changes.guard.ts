import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../../members/member-edit/member-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {

  if (component.editForm?.dirty) {
    return confirm('Bạn chắc chắn muốn thoát? Tất cả những thay đổi của bạn sẽ không được lưu lại');
  }
  
  return true;
};
