import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared/models/account/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  api = environment.appUrl;

  private http = inject(HttpClient);

  constructor() { }

  getUserRoles() {
    return this.http.get<User[]>(`${this.api}/admin/get-user-roles`);
  }

  updateUserRoles(username: string, role: string[]) {
    return this.http.post<string[]>(`${this.api}/admin/edit-roles/${username}?roles=${role}`,{});
  }
}
