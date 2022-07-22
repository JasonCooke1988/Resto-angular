import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() buttonText: string = '';
  @Input() buttonState: string = 'validate';
  @Input() buttonDisabled: boolean = false;
  @Input() icon: string = '';
  mouseDown: string = 'false';

  constructor() {
  }

  toggleMouseDown() {
    this.mouseDown = this.mouseDown === 'true' ? 'false' : 'true';
  }
}
