import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import {MatMenuModule} from "@angular/material/menu";
import {ButtonComponent} from "./button/button.component";

@NgModule({
  declarations: [
    MenuComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule
  ],
  exports: [
    MenuComponent,
    MatMenuModule,
    ButtonComponent
  ]
})
export class ComponentsModule {
}
