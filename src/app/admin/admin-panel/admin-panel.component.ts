import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { User } from '../../shared/models/account/user.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit{
  
  ngOnInit(): void {
    
  }
  

}
