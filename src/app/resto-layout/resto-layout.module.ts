import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestoLayoutComponent } from './resto-layout.component';
import { ControlsComponent } from './controls/controls.component';
import {ComponentsModule} from "../components/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TableControlsComponent } from './controls/table-controls/table-controls.component';

@NgModule({
  declarations: [
    RestoLayoutComponent,
    ControlsComponent,
    TableControlsComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    RestoLayoutComponent
  ]
})

export class RestoLayoutModule {
}
