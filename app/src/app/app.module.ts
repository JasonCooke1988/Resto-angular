import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {RestoLayoutModule} from "./resto-layout/resto-layout.module";
import {ComponentsModule} from "./components/components.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HomeModule} from "./home/home.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RestoLayoutModule,
    ComponentsModule,
    BrowserAnimationsModule,
    HomeModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
