import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationsPageComponent } from './pages/applications-page/applications-page.component';
import { ApplicationDetailsDialogComponent } from './components/application-details-dialog/application-details-dialog.component';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    ApplicationsPageComponent,
    ApplicationDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogActions,
    MatDialogContent
  ]
})
export class AdminToolsModule { }
