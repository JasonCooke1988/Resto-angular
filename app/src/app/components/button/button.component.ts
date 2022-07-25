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
  @Input() tooltip: any = {message: '', state: '', disabledMessage: ''};
  mouseDown: string = 'false';

  constructor() {
    this.tooltip.state = this.buttonDisabled ? 'warning' : '';
  }

  ngOnChanges(){
    this.tooltip.state = this.buttonDisabled ? 'warning' : '';
  }

  toggleMouseDown() {
    this.mouseDown = this.mouseDown === 'true' ? 'false' : 'true';
  }
}
