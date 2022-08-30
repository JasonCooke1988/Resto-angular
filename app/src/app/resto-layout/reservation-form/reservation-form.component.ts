import {Component, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {FormBuilder, Validators} from "@angular/forms";
import {BehaviorSubject, debounceTime, distinctUntilChanged, from, fromEvent, Observable, tap} from "rxjs";
import {popInAnimation} from "../../animation";
import {exhaustMap} from "rxjs/operators"

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

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    //Construct observable for submitting form
    const form = document.getElementById('reservation-form')!;
    const formSubmit$ = fromEvent<any>(form, 'submit').pipe(
      debounceTime(1000)
    );

    formSubmit$.subscribe(() => {
      this.submitReservation()
    });
  }

  submitReservation() {

    const moment = require('moment');

    const time = this.reservationForm.value.reservationTime!.split(':');
    let dateToParse = new Date(this.reservationForm.value.reservationDate!).setHours(parseInt(time[0]), parseInt(time[1]));
    const date = moment(dateToParse).utcOffset(0, true).format();

    fetch('/api/save_reservation', {
      method: 'POST',
      body: JSON.stringify({tableNumber: this.selectedTable?.tableNumber, date: date}),
      headers: {
        'content-type': 'application/json'
      }
    }).then((res) => {
      // let test = res.json();
      // console.log('reservation saved')
      // console.log(test.success)
      // this.successSubject.next('Votre réservation à été enregistrée.')
      // setTimeout(() => this.successSubject.next(null), 5000)
      if (res.ok) {
        let test = res.json();
        test.then((r) => {
          if (r.success) {
            this.successSubject.next('Votre réservation à été enregistrée.')
            setTimeout(() => this.successSubject.next(null), 5000)
          } else {
            this.successSubject.next('La table sélectionnée n\'est pas disponible. ' +
              'Veuillez réessayer avec une autre table ou une autre plage horaire.')
            setTimeout(() => this.successSubject.next(null), 5000)
          }
        })
      } else {
        console.error('Erreur de reservation')
      }
    }).catch(e => console.error(e))

  }

}
