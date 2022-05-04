import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CanvasComponent} from "./canvas/canvas.component";
import { RestoLayoutComponent } from './resto-layout.component';
import { ControlsComponent } from './controls/controls.component';
import { TableDetailComponent } from './table-detail/table-detail.component';
import {ComponentsModule} from "../components/components.module";


@NgModule({
  declarations: [
    CanvasComponent,
    RestoLayoutComponent,
    ControlsComponent,
    TableDetailComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
  ],
  exports: [
    CanvasComponent,
    RestoLayoutComponent
  ]
})
export class RestoLayoutModule { }
