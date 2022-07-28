import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {FormControl, FormGroup} from "@angular/forms";
import moment from "moment";
import {from} from "rxjs";

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {

  @Input() selectedTable?: Table | null = null;

  //Reservation form
  reservationForm = new FormGroup({
    reservationDate: new FormControl(''),
    // reservationTime: new FormControl('')
  })
  startDate: Date = new Date();

  constructor() { }

  ngOnInit(): void {
  }

  submitReservation() {

    return from(fetch('/api/save_reservation', {
      method: 'POST',
      body: JSON.stringify({tableNumber: this.selectedTable?.tableNumber, date: this.reservationForm.value.reservationDate}),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => {
      console.log('reservation saved')
    }).catch(e => console.error(e)))

  }

}
