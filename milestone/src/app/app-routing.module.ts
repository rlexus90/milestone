import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './core/pages/registration/registration.component';
import { LoginComponent } from './core/pages/login/login.component';
import { MainComponent } from './core/pages/main/main.component';
import { chekIsLogin } from './shared/helpers/isLogin';
import { guardsGuard } from './core/guards.guard';
import { ProfileComponent } from './core/pages/profile/profile.component';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { GroupDialogComponent } from './core/pages/group-dialog/group-dialog.component';
import { ConversationComponent } from './core/pages/conversation/conversation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: chekIsLogin() ? 'main' : 'signin',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    component: RegistrationComponent,
  },
  { path: 'signin', component: LoginComponent },
  { path: 'main', component: MainComponent, canActivate: [guardsGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [guardsGuard] },
  {
    path: 'group/:id',
    component: GroupDialogComponent,
    canActivate: [guardsGuard],
  },
  {
    path: 'conversation/:id',
    component: ConversationComponent,
    canActivate: [guardsGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
