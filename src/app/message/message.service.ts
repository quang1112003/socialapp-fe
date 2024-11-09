import { inject, Injectable, NgZone, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../shared/models/user/pagination.model';
import { Message } from '../shared/models/message/message.model';
import { setPaginateResponse, setPaginationHeaders } from '../shared/pagination-helpers';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from '../account/account.service';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

}
