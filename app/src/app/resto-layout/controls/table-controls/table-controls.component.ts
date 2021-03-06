import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Table} from "../../../core/models/table.model";
import {debounceTime, fromEvent, mergeWith, tap} from "rxjs";

@Component({
  selector: 'app-table-controls',
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.scss']
})
export class TableControlsComponent implements OnInit {

  selectedTableForm!: FormGroup;
  @Input() selectedTable?: Table | null = null;

  @Output() modifyTableEvent = new EventEmitter();

  @ViewChild('seatsInput') seatsInput!: ElementRef;
  @ViewChild('tableNumberInput') tableNumberInput!: ElementRef;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {

    this.selectedTableForm = this.formBuilder.group({
      seats: this.selectedTable?.seats,
      tableNumber: this.selectedTable?.tableNumber
    })

  }

  ngAfterViewInit() {

    const tableSeats$ = fromEvent(this.seatsInput.nativeElement, 'change');
    const tableNumber$ = fromEvent(this.tableNumberInput.nativeElement, 'change');

    const fromValueChanges$ = tableSeats$.pipe(mergeWith(tableNumber$));

    fromValueChanges$.pipe(
      debounceTime(400),
      tap(formValue => {
        this.modifyTableEvent.emit();
      })
    ).subscribe()

  }

}
