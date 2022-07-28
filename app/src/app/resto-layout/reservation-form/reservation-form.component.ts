import {Component, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {FormBuilder, Validators} from "@angular/forms";
import {BehaviorSubject, from, Observable} from "rxjs";
import {popInAnimation} from "../../animation";

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
  animations: [popInAnimation],
})
export class ReservationFormComponent {

  @Input() selectedTable?: Table | null = null;

  //Reservation form
  reservationForm = this.fb.group({
    reservationDate: ['', Validators.required],
    reservationTime: ['', Validators.required]
  })
  startDate: Date = new Date();

  private successSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public success$: Observable<string | null> = this.successSubject.asObservable();

  constructor(private fb: FormBuilder) { }

  submitReservation() {

    const moment = require('moment');

    const time = this.reservationForm.value.reservationTime!.split(':');
    let dateToParse = new Date(this.reservationForm.value.reservationDate!).setHours(parseInt(time[0]),parseInt(time[1]));
    const date = moment(dateToParse).utcOffset(0,true).format();

    return from(fetch('/api/save_reservation', {
      method: 'POST',
      body: JSON.stringify({tableNumber: this.selectedTable?.tableNumber, date: date}),
      headers: {
        'content-type': 'application/json'
      }
    }).then(() => {
      console.log('reservation saved')
      this.successSubject.next('Votre réservation à été enregistrée.')
      setTimeout(() => this.successSubject.next(null), 5000)
    }).catch(e => console.error(e)))

  }

}
