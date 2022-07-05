import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  template:
    `
      <button
        (click)="toggleMouseDown()"
        [ngClass]="[buttonState === 'validate' ? 'bg-denim hover:bg-denim/80' : '', buttonState === 'alert' ? 'bg-red-700 hover:bg-red-700/80' : '']"
        class="font-small uppercase text-white py-2 px-4 rounded transition ease duration-500 cursor:pointer">
        {{ buttonText }}</button>`,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() buttonText!: string;
  @Input() buttonState: string = 'validate';
  mouseDown: string = 'false';

  constructor() {
  }

  toggleMouseDown() {
    this.mouseDown = this.mouseDown === 'true' ? 'false' : 'true';
  }
}
