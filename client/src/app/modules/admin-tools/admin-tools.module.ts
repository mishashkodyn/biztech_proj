import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationsPageComponent } from './pages/applications-page/applications-page.component';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    ApplicationsPageComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule
  ]
})
export class AdminToolsModule { }
