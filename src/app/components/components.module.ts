import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import {MatMenuModule} from "@angular/material/menu";
import {ButtonComponent} from "./button/button.component";
import {AppRoutingModule} from "../app-routing.module";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    MenuComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    AppRoutingModule,
    MatButtonModule
  ],
  exports: [
    MenuComponent,
    MatMenuModule,
    ButtonComponent
  ]
})
export class ComponentsModule {
}
