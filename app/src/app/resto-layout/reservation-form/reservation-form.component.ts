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
export class ReservationFormComponent implements OnInit {

  @Input() selectedTable?: Table | null = null;

  //Reservation form
  reservationForm = this.fb.group({
    reservationDate: ['', Validators.required],
    reservationTime: ['', Validators.required]
  })
  startDate: Date = new Date();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  submitReservation() {

    const moment = require('moment');

    console.log(this.reservationForm.value.reservationDate)

    const time = this.reservationForm.value.reservationTime!.split(':');
    let date = new Date(Date.parse(this.reservationForm.value.reservationDate!));

    date.setHours(parseInt(time[0]) + 2,parseInt(time[1]),0);

    // console.log(date.toUTCString())

    console.log(date.toUTCString())

    // const date = moment().utc(this.reservationForm.value.reservationDate).format();
    // const time = this.reservationForm.value.reservationTime.split(':');
    //
    // date.set({
    //   hour: time[0],
    //   minute: time[1]
    // })
    // console.log(date)
    //

    return from(fetch('/api/save_reservation', {
      method: 'POST',
      body: JSON.stringify({tableNumber: this.selectedTable?.tableNumber, date: date.toUTCString()}),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => {
      console.log('reservation saved')
    }).catch(e => console.error(e)))

  }

}
