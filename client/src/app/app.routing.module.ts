import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './modules/chat/pages/chat/chat.component';
import { LoginComponent } from './modules/core/pages/login/login.component';
import { RegisterComponent } from './modules/core/pages/register/register.component';

import { AuthGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { LayoutComponent } from './modules/core/layouts/layout/layout.component';
import { HomePageComponent } from './modules/core/pages/home-page/home-page.component';
import { UsersPageComponent } from './modules/core/pages/users-page/users-page.component';
import { UserAccountPageComponent } from './modules/core/pages/user-account-page/user-account-page.component';
import { SettingsPageComponent } from './modules/core/pages/settings-page/settings-page.component';
import { EditAccountPageComponent } from './modules/core/pages/edit-account-page/edit-account-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'chat', component: ChatComponent },
      { path: 'home', component: HomePageComponent },
      { path: 'users', component: UsersPageComponent },
      { path: 'account/:username', component: UserAccountPageComponent },
      { path: 'settings', component: SettingsPageComponent},
      { path: 'edit-account', component: EditAccountPageComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '**',
    redirectTo: 'chat',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
