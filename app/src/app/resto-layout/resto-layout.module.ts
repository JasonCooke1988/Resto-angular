import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestoLayoutComponent } from './resto-layout.component';
import { LayoutControlsComponent } from './controls/layout-controls.component';
import {ComponentsModule} from "../components/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TableControlsComponent } from './controls/table-controls/table-controls.component';
import {CanvasService} from "../core/services/canvas.service";

@NgModule({
  declarations: [
    RestoLayoutComponent,
    LayoutControlsComponent,
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
  ],
  providers: [
    CanvasService
  ]
})

export class RestoLayoutModule {
}
