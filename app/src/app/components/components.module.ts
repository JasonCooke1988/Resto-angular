import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {ButtonComponent} from "./button/button.component";
import {AppRoutingModule} from "../app-routing.module";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    AppRoutingModule,
    MatButtonModule
  ],
  exports: [
    MatMenuModule,
    ButtonComponent
  ]
})
export class ComponentsModule {
}
