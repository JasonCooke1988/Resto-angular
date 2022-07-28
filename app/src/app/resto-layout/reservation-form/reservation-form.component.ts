import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {FormBuilder, Validators} from "@angular/forms";
import {from} from "rxjs";
import moment from "moment";

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent {

  @Input() selectedTable?: Table | null = null;

  //Reservation form
  reservationForm = this.fb.group({
    reservationDate: ['', Validators.required],
    reservationTime: ['', Validators.required]
  })
  startDate: Date = new Date();

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
    }).catch(e => console.error(e)))

  }

}
