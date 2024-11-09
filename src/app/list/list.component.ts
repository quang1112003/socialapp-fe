import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LikeService } from '../members/like.service';
import { Member } from '../shared/models/user/member.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy{
  likeService = inject(LikeService);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadLike();
  }

  loadLike() {
    this.likeService.getLikes(this.predicate,this.pageNumber, this.pageSize);
  }

  pageChanged(event: PageChangedEvent) {
    if(this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadLike();
    }
  }

  ngOnDestroy(): void {
    this.likeService.paginatedResult.set(null);
  }

}
