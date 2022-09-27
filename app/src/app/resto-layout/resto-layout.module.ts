import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestoLayoutComponent } from './resto-layout.component';
import { LayoutControlsComponent } from './controls/layout-controls.component';
import {ComponentsModule} from "../components/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TableControlsComponent } from './controls/table-controls/table-controls.component';
import {CanvasService} from "../core/services/canvas.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    RestoLayoutComponent,
    LayoutControlsComponent,
    TableControlsComponent,
    ReservationFormComponent
  ],
    imports: [
        CommonModule,
        ComponentsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatProgressSpinnerModule
    ],
  exports: [
    RestoLayoutComponent
  ],
  providers: [
    CanvasService
  ]
})

export class RestoLayoutModule {
}
