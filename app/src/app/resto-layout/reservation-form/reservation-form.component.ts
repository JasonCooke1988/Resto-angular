import {Component, Input} from '@angular/core';
import {Table} from "../../core/models/table.model";
import {FormBuilder, Validators} from "@angular/forms";
import {BehaviorSubject, debounceTime, fromEvent, Observable} from "rxjs";
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

  private alertSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  public alert$: Observable<any | null> = this.alertSubject.asObservable();

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
      if (res.ok) {
        let test = res.json();
        test.then((r) => {
          if (r.success) {
            this.alertSubject.next({message: 'Votre réservation à été enregistrée.', type: 'success'})
            setTimeout(() => this.alertSubject.next(null), 5000)
          } else {
            this.alertSubject.next({message: 'La table sélectionnée n\'est pas disponible. ' +
                'Veuillez réessayer avec une autre table ou une autre plage horaire.', type: 'error'})
            setTimeout(() => this.alertSubject.next(null), 5000)
          }
        })
      } else {
        console.error('Erreur de reservation')
      }
    }).catch(e => console.error(e))

  }

}
