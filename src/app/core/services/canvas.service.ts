import {Injectable} from '@angular/core';
import {TablesService} from "./tables.service";
import {Table} from "../models/table.model";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor(private tableService: TablesService) {
  }

  detectOverlap(element: Table,
                compare: Table) {

    return !(element.x < compare.x + compare.width &&
      element.x + element.width > compare.x &&
      element.y < compare.y + compare.height &&
      element.height + element.y > compare.y)

  }
}
