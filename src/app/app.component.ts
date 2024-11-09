import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private accountService: AccountService, public router: Router) {
    
  }

  ngOnInit(): void {
    this.initializeUserSession();
  }

  private initializeUserSession() {
    const jwt = this.accountService.getJWT();

    if (jwt) {
      // this.accountService.refreshUser(jwt).subscribe();
    }
  }
  
}
