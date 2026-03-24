import { Component } from '@angular/core';

@Component({
  selector: 'app-psychologist-registration',
  standalone: false,
  templateUrl: './psychologist-registration.component.html',
  styleUrl: './psychologist-registration.component.scss'
})
export class PsychologistRegistrationComponent {
  currentStep = 1;
  totalSteps = 3;

  // Дані заявки (в реальності тут буде FormGroup)
  applicationData = {
    firstName: '',
    lastName: '',
    phone: '',
    experienceYears: null,
    education: '',
    specializations: [] as string[],
    diplomaFiles: [] as File[]
  };

  availableSpecializations = [
    'ПТСР та бойова травма', 'Втрата та горе', 
    'Тривожні розлади', 'Депресія', 
    'Сімейна терапія', 'Робота з дітьми'
  ];

  nextStep() {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  toggleSpecialization(spec: string) {
    const index = this.applicationData.specializations.indexOf(spec);
    if (index > -1) {
      this.applicationData.specializations.splice(index, 1);
    } else {
      this.applicationData.specializations.push(spec);
    }
  }

  submitApplication() {
    console.log('Заявка відправлена на модерацію:', this.applicationData);
    // Тут буде виклик API
  }
}
