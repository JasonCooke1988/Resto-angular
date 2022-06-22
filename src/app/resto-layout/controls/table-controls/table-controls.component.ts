import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Table} from "../../../core/models/table.model";
import {tap} from "rxjs";

@Component({
  selector: 'app-table-controls',
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.scss']
})
export class TableControlsComponent implements OnInit {

  selectedTableForm!: FormGroup;
  @Input() selectedTable?: Table | null = null;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.selectedTableForm = this.formBuilder.group({
      seats: this.selectedTable?.seats,
      tableNumber: this.selectedTable?.tableNumber
    })

    this.selectedTableForm.valueChanges.pipe(
      tap(formValue => {

        if(this.selectedTable != null) {
          this.selectedTable.seats = formValue.seats ? formValue.seats : this.selectedTable?.seats;
          this.selectedTable.tableNumber = formValue.tableNumber ? formValue.tableNumber : this.selectedTable?.tableNumber;
        }
      })
    ).subscribe();
  }

}
