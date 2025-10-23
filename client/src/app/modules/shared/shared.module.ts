import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { TypingIndicatorComponent } from './typing-indicator/typing-indicator.component';
import { LogoutConfirmModalComponent } from './logout-confirm-modal/logout-confirm-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";


@NgModule({
  declarations: [
    ButtonComponent,
    TypingIndicatorComponent,
    LogoutConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIcon
],
  exports: [
    ButtonComponent,
    TypingIndicatorComponent,
    LogoutConfirmModalComponent
  ]
})
export class SharedModule { }
