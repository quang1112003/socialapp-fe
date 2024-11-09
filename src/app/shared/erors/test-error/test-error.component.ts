import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent implements OnInit{
  sharedService = inject(SharedService);

  constructor() {

  }

  ngOnInit(): void {

  }

  get400Error() {
    this.sharedService.get400Error().subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error)
    });
  }

  get401Error() {
    this.sharedService.get401Error().subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error)
    });
  }

  get500Error() {
    this.sharedService.get500Error().subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error)
    });
  }

  get404Error() {
    this.sharedService.get404Error().subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error)
    });
  }
  
}
