import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../shared/models/user/member.model';
import { PaginatedResult } from '../shared/models/user/pagination.model';
import { setPaginateResponse, setPaginationHeaders } from '../shared/pagination-helpers';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  api = environment.appUrl;

  private http = inject(HttpClient);

  likeIds = signal<string[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  likedCount = signal<number>(0);     // Số lượng người bạn thích
  likedByCount = signal<number>(0);   // Số lượng người thích bạn

  constructor() { }

  toggleLike(targetId: string) {
    return this.http.post(`${this.api}/likes/toggle/${targetId}`,{});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = setPaginationHeaders(pageNumber, pageSize);

    return this.http.get<Member[]>(`${this.api}/likes?predicate=${predicate}`, 
      {observe: 'response', params}
    ).subscribe({
      next: response => {
        setPaginateResponse(response, this.paginatedResult);

          // Xử lý số lượng dựa trên predicate
          if (predicate === 'liked') {
            this.likedCount.set(response.body?.length || 0);  // Lưu số lượng người bạn thích
          } else if (predicate === 'likedBy') {
            this.likedByCount.set(response.body?.length || 0);  // Lưu số lượng người thích bạn
          }
      }
    });
  }

  getLikedIds() {
    return this.http.get<string[]>(`${this.api}/likes/liked-by-me`).subscribe({
      next: (ids) => {
        this.likeIds.set(ids);
      },
    }); 
  }

  getLikedCount(userId: string) {
    return this.http.get<number>(`${this.api}/likes/liked-count/${userId}`);
  }

  getLikedByCount(userId: string) {
    return this.http.get<number>(`${this.api}/likes/liked-by-count/${userId}`);
  }

}
