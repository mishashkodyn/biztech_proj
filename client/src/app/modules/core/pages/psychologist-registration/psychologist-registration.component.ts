import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreatePsychologistApplicationDto } from '../../../../api/models/psychologist-application.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../api/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-psychologist-registration',
  standalone: false,
  templateUrl: './psychologist-registration.component.html',
  styleUrl: './psychologist-registration.component.scss',
})
export class PsychologistRegistrationComponent implements OnInit {
  currentStep = 1;
  totalSteps = 3;
  isLoading = false;
  applicationForm!: FormGroup;

  availableSpecializations = [
    'PTSD & Combat Trauma',
    'Grief & Loss',
    'Anxiety Disorders',
    'Depression',
    'Family Therapy',
    'Child & Adolescent Therapy',
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.applicationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?380\d{9}$/)]], // Проста валідація укр номера
      education: ['', Validators.required],
      experienceYears: [null, [Validators.required, Validators.min(0)]],
      specializations: [[] as string[], Validators.required],
      documents: [[] as File[], Validators.required],
    });
  }

  nextStep() {
    const stepControls = this.getControlsForStep(this.currentStep);

    const isStepValid = stepControls.every((controlName) => {
      const control = this.applicationForm.get(controlName);
      return control?.valid !== false;
    });

    if (isStepValid) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }

      if (this.currentStep > this.totalSteps) {
        this.submitApplication();
      }
    } else {
      stepControls.forEach((controlName) => {
        this.applicationForm.get(controlName)?.markAsTouched();
      });

      this.snackBar.open(
        'Please fill in all required fields for this step.',
        'Close',
        {
          duration: 2000,
        },
      );
    }
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  private getControlsForStep(step: number): string[] {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'phone'];
      case 2:
        // return ['education', 'experienceYears', 'documents'];
        return ['education', 'experienceYears'];
      case 3:
        return ['specializations'];
      default:
        return [];
    }
  }

  toggleSpecialization(spec: string) {
    const index = this.applicationForm.value.specializations.indexOf(spec);
    if (index > -1) {
      this.applicationForm.value.specializations.splice(index, 1);
    } else {
      this.applicationForm.value.specializations.push(spec);
    }
  }

  submitApplication() {
    this.isLoading = true;
    this.authService
      .psychologistRegister(this.applicationForm.value)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.isSuccess == false) {
            this.snackBar.open(
              res.error ||
                'Failed to submit application. Please try again later.',
              'Close',
              {
                duration: 3000,
              },
            );
            return;
          }
          this.router.navigate(['/application-success']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Failed to submit application. Please try again later.',
            'Close',
            {
              duration: 3000,
            },
          );
        },
      });
  }
}
