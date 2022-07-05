import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Table} from "../../../core/models/table.model";
import {debounceTime, fromEvent, mergeWith, tap} from "rxjs";
import {TablesService} from "../../../core/services/tables.service";

@Component({
  selector: 'app-table-controls',
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.scss']
})
export class TableControlsComponent implements OnInit {

  selectedTableForm!: FormGroup;
  @Input() selectedTable?: Table | null = null;

  @ViewChild('seatsInput') seatsInput!: ElementRef;
  @ViewChild('tableNumberInput') tableNumberInput!: ElementRef;

  constructor(private formBuilder: FormBuilder,
              private tableService: TablesService) {
  }

  ngOnInit(): void {

    this.selectedTableForm = this.formBuilder.group({
      seats: this.selectedTable?.seats,
      tableNumber: this.selectedTable?.tableNumber
    })

    // this.selectedTableForm.valueChanges.pipe(
    //   tap(formValue => {
    //
    //     console.log('coucou')
    //
    //
    //     console.log(this.selectedTable)
    //
    //     //delete this
    //     if (this.selectedTable != null) {
    //       this.selectedTable.seats = formValue.seats ? formValue.seats : this.selectedTable?.seats;
    //       this.selectedTable.tableNumber = formValue.tableNumber ? formValue.tableNumber : this.selectedTable?.tableNumber;
    //     }
    //   })
    // ).subscribe(v => console.log('ouasih'));
  }

  ngAfterViewInit() {
    console.log(this.seatsInput)

    const tableSeats$ = fromEvent(this.seatsInput.nativeElement, 'change');
    const tableNumber$ = fromEvent(this.tableNumberInput.nativeElement, 'change');

    const formValueChanges = tableSeats$.pipe(mergeWith(tableNumber$));

    tableSeats$.pipe(
      debounceTime(400),
      tap(formValue => {
        this.tableService.modifyTable(this.selectedTable!);
        console.log('coucou')
      })
    ).subscribe(v => console.log())

  }

}
