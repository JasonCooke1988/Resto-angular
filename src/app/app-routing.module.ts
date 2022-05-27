import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CanvasComponent} from "./resto-layout/canvas/canvas.component";
import {HomeComponent} from "./home/home.component";
import {RestoLayoutComponent} from "./resto-layout/resto-layout.component";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'resto-admin', component: RestoLayoutComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
