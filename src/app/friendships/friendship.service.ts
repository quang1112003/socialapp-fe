import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Friendships, FriendshipStatus } from '../shared/models/user/friendships.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {
  private apiUrl = environment.appUrl;

  constructor(private http: HttpClient) { }

  getFriendships(predicate: FriendshipStatus) {
    const params = new HttpParams().set('predicate', predicate);

    return this.http.get<Friendships[]>(`${this.apiUrl}/friendships`, { params });
  }

    // Chấp nhận yêu cầu kết bạn
    acceptFriendRequest(friendId: string) {
      return this.http.post<Friendships>(`${this.apiUrl}/friendships/accept/${friendId}`, {});
    }
  
    // Từ chối yêu cầu kết bạn
    rejectFriendRequest(friendId: string) {
      return this.http.post(`${this.apiUrl}/friendships/reject/${friendId}`, {});
    }

}
