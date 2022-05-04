import { Component, OnInit } from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, MatMenuModule {

  constructor() { }

  ngOnInit(): void {
  }

}
