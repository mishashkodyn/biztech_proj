import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RouterLink, RouterModule, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LayoutComponent } from './layouts/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserAccountPageComponent } from './pages/user-account-page/user-account-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { EditAccountPageComponent } from './pages/edit-account-page/edit-account-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
    SidebarComponent,
    HomePageComponent,
    UsersPageComponent,
    UserAccountPageComponent,
    SettingsPageComponent,
    EditAccountPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    RouterLinkActive,
    MatToolbarModule,
    MatTooltipModule,
    BrowserAnimationsModule
] 
})
export class CoreModule { }
