import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {RestoLayoutComponent} from "./resto-layout/resto-layout.component";

const routes: Routes = [
  { path: '', component: HomeComponent, data:{ animation: 'Home'}},
  { path: 'resto-admin', component: RestoLayoutComponent, data:{ animation: 'RestoAdmin', layoutAdminRights: true}},
  { path: 'client', component: RestoLayoutComponent, data:{ animation: 'Client', layoutAdminRights: false}}
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
