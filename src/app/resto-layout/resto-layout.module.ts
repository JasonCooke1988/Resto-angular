import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasComponent} from "./canvas/canvas.component";
import { RestoLayoutComponent } from './resto-layout.component';
import { ControlsComponent } from './controls/controls.component';
import { TableDetailComponent } from './table-detail/table-detail.component';
import {ComponentsModule} from "../components/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableControlsComponent} from "./controls/table-controls.component";


@NgModule({
  declarations: [
    CanvasComponent,
    RestoLayoutComponent,
    ControlsComponent,
    TableDetailComponent,
    TableControlsComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    CanvasComponent,
    RestoLayoutComponent
  ]
})
export class RestoLayoutModule { }
