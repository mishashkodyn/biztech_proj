import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { TypingIndicatorComponent } from './typing-indicator/typing-indicator.component';



@NgModule({
  declarations: [
    ButtonComponent,
    TypingIndicatorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    TypingIndicatorComponent
  ]
})
export class SharedModule { }
