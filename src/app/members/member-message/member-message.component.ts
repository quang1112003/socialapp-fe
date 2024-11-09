import { AfterViewChecked, Component, ElementRef, inject, input, output, ViewChild } from '@angular/core';
import { Message } from '../../shared/models/message/message.model';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../message/message.service';
import { NgForm } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrl: './member-message.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class MemberMessageComponent implements AfterViewChecked{
    ngAfterViewChecked(): void {
    }
  // @ViewChild('chatBody') chatBody!: ElementRef;
  // @ViewChild('messageForm') messageForm?: NgForm;
  //
  // private messageService = inject(MessageService);
  //
  // username = input.required<string>();
  // messages = input.required<Message[]>();
  // chatUserPhotoUrl = input.required<string>();
  // chatUserName = input.required<string>();
  // messageContent = '';
  // updateMessage = output<Message>();
  //
  // sendMessage() {
  //   this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
  //     next: (response: Message) => {
  //       this.updateMessage.emit(response);
  //       this.messageForm?.reset();
  //     }
  //   })
  // }
  //
  //    // Tự động cuộn xuống cuối
  //    ngAfterViewChecked() {
  //     this.scrollToBottom();
  //   }
  //
  // scrollToBottom(): void {
  //   try {
  //     this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
  //   } catch(err) { }
  // }
}
