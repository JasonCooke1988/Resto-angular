import {ElementRef, Injectable} from '@angular/core';
import {TablesService} from "./tables.service";
import {Table} from "../models/table.model";
import {CanvasComponent} from "../../resto-layout/canvas/canvas.component";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor(private tableService: TablesService) {
  }

  detectOverlap(element: Table, compare: Table) {
    return (element.x < compare.x + compare.width &&
      element.x + element.width > compare.x &&
      element.y < compare.y + compare.height &&
      element.height + element.y > compare.y)
  }

  detectOutOfBounds(element: Table, canvas: any) {
    return (element.x < 10 || element.y < 10 || element.x + element.width > canvas.width - 10 || element.y + element.height > canvas.height -10);
  }
}
