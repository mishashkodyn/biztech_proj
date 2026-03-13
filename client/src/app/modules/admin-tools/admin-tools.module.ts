import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';



@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule
  ]
})
export class AdminToolsModule { }
