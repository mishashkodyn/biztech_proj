import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  isDisabled = input<boolean>();
  isLoading = input<boolean>();
  action = output<void>();
  text = input.required<string>();

  clickHandler() {
    this.action.emit();
  }
}
