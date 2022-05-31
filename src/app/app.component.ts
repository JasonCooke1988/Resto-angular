import {Component, ViewChild} from '@angular/core';
import {ChildrenOutletContexts} from "@angular/router";
import {slideInAnimation} from "./animation";
import {RestoLayoutComponent} from "./resto-layout/resto-layout.component";
import {HomeComponent} from "./home/home.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'Resto : Application de reservation';

  @ViewChild(RestoLayoutComponent) restoLayout!: RestoLayoutComponent;
  @ViewChild(HomeComponent) homeComponent!: HomeComponent;

  constructor(private contexts: ChildrenOutletContexts) {
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
