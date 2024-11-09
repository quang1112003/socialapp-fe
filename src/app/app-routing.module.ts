import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/erors/not-found/not-found.component';
import { authorizationGuard } from './shared/guard/authorization.guard';
import { ListComponent } from './list/list.component';
import { MessageComponent } from './message/message.component';
import { TestErrorComponent } from './shared/erors/test-error/test-error.component';
import { ServerErrorComponent } from './shared/erors/server-error/server-error.component';
import { adminGuard } from './shared/guard/admin.guard';
import { FriendshipComponent } from './friendships/friendship/friendship.component';
import { ListFriendsComponent } from './friendships/list-friends/list-friends.component';
import { LoginComponent } from './account/login/login.component';
import { CallvideoComponent } from './callvideo/callvideo.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authorizationGuard],
    children: [
      { path: 'list', component: ListComponent },
      { path: 'friendships', component: FriendshipComponent },
      { path: 'list-friendships', component: ListFriendsComponent },
      { path: 'message', component: MessageComponent },
      { path: 'callvideo', component: CallvideoComponent },

      {
        path: 'members',
        loadChildren: () =>
          import('./members/member.module').then(
            (module) => module.MemberModule
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then(
            (module) => module.AdminModule
          ),
          canActivate: [adminGuard]
      },

    ],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((module) => module.AccountModule),
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
  },
  {
    path: 'test-error',
    component: TestErrorComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
