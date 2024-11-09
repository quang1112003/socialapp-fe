import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NavbarComponent } from './navbar/navbar.component';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { provideHttpClient, withInterceptors, withJsonpSupport } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListComponent } from './list/list.component';
import { MessageComponent } from './message/message.component';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { loadingInterceptor } from './shared/interceptors/loading.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FriendshipComponent } from './friendships/friendship/friendship.component';
import { ListFriendsComponent } from './friendships/list-friends/list-friends.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { CallvideoComponent } from './callvideo/callvideo.component';
import { FormsModule } from '@angular/forms';

import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListComponent,
    MessageComponent,
    FriendshipComponent,
    ListFriendsComponent,
    CallvideoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    BrowserAnimationsModule,
    BsDropdownModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    // QuillModule.forRoot({
    //   customOptions: [{
    //     import: 'formats/font',
    //     whitelist: ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace']
    //   }],
    //   modules: {
    //     toolbar: [
    //       ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //       ['blockquote', 'code-block'],

    //       [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    //       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //       [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    //       [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    //       [{ 'direction': 'rtl' }],
    //       [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    //     ]
    //   },
    // }),
    ScrollingModule,
    DragDropModule,
    NzUploadModule,
    DemoNgZorroAntdModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor, loadingInterceptor]), withJsonpSupport()),
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons }

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
