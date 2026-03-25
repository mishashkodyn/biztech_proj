import { Component, OnInit } from '@angular/core';
import { ApplicationsService } from '../../../../api/services/applications.service';
import { PsychologistApplicationResponseDto } from '../../../../api/models/psychologist-application.model';
import { ApplicationDetailsDialogComponent } from '../../components/application-details-dialog/application-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-applications-page',
  standalone: false,
  templateUrl: './applications-page.component.html',
  styleUrl: './applications-page.component.scss',
})
export class ApplicationsPageComponent implements OnInit {
  applications: PsychologistApplicationResponseDto[] = [];
  isLoading = true;
  selectedApp: PsychologistApplicationResponseDto | null = null;

  constructor(
    private service: ApplicationsService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.isLoading = true;
    this.service.getPsychologistApplications().subscribe({
      next: (res) => {
        if (!res.isSuccess) {
          console.error('Error loading applications', res.message);
          this.isLoading = false;
          return;
        }
        this.applications = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading applications', err);
        this.isLoading = false;
      },
    });
  }

  closeDetails() {
    this.selectedApp = null;
    document.body.style.overflow = 'auto';
  }

  approveApplication(id: string) {
    console.log('Схвалюємо заявку:', id);
    // Тут буде виклик бекенду
  }

  rejectApplication(id: string) {
    console.log('Відхиляємо заявку:', id);
    // Тут буде виклик бекенду
  }

  viewDetails(app: PsychologistApplicationResponseDto) {
    const dialogRef = this.dialog.open(ApplicationDetailsDialogComponent, {
      width: '100%',
      maxWidth: '42rem',
      data: { app: app },
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.action === 'approve') {
          this.approveApplication(result.id);
        } else if (result.action === 'reject') {
          this.rejectApplication(result.id);
        }
      }
    });
  }
}
