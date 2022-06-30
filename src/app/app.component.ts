import {Component, OnInit} from '@angular/core';
import {ChildrenOutletContexts} from "@angular/router";
import {slideInAnimation} from "./animation";
import {TablesService} from "./core/services/tables.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent implements OnInit {
  title = 'Resto : Application de reservation';

  constructor(private contexts: ChildrenOutletContexts, private tableService: TablesService) {
  }

  ngOnInit() {
    this.tableService.init();
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
