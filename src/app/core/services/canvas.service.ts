import {Injectable} from '@angular/core';
import {Table} from "../models/table.model";
import {Mouse} from "../models/mouse.model";
import {TablesService} from "./tables.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {


  constructor(private tableService: TablesService) {

  }

  detectOutOfBounds(element: any, canvas: any) {
    return (element.x < 10 || element.y < 10 || element.x + element.width > canvas.width - 10 || element.y + element.height > canvas.height - 10);
  }

  updateMousePos(args: any) {

    args['mouse'].x = args['evt'].clientX - args['layoutState']['layout'].offsetLeft;
    args['mouse'].y = args['evt'].clientY - args['layoutState']['layout'].offsetTop;

    if (!args['layoutState']['dragging']) {
      args['mouse'].state = 'default';
      this.mouseHoverDetection(args['tables'], args['mouse']);
    }

  }

  editTablePlaceSize(event: Event, tables: Table[], layoutState: any, mouse: Mouse) {

    tables.forEach(table => {
      if (table.hovering && table.selected) {

        let cloneTable,
          yDiff,
          xDiff;

        switch (mouse.state) {
          case 'move':
            cloneTable = {
              x: mouse.x - table.width / 2,
              y: mouse.y - table.height / 2
            };
            break;
          case 'ne-resize':
            yDiff = table.y - mouse.y;
            xDiff = mouse.x - (table.x + table.width);
            cloneTable = {
              y: mouse.y,
              height: table.height += yDiff,
              width: table.width += xDiff
            };
            break;
          case 'nw-resize':
            yDiff = table.y - mouse.y;
            xDiff = table.x - mouse.x;
            cloneTable = {
              y: mouse.y,
              x: mouse.x,
              height: table.height += yDiff,
              width: table.width += xDiff
            };
            break;
          case 'se-resize':
            yDiff = mouse.y - (table.y + table.height);
            xDiff = mouse.x - (table.x + table.width);
            cloneTable = {
              height: table.height += yDiff,
              width: table.width += xDiff
            };
            break;
          case 'sw-resize':
            yDiff = mouse.y - (table.y + table.height);
            xDiff = table.x - mouse.x;
            cloneTable = {
              x: mouse.x,
              height: table.height += yDiff,
              width: table.width += xDiff
            };
            break;
          case 'n-resize':
            yDiff = table.y - mouse.y;
            cloneTable = {
              y: mouse.y,
              height: table.height += yDiff,
            };
            break;
          case 's-resize':
            yDiff = mouse.y - (table.y + table.height);
            cloneTable = {
              height: table.height += yDiff,
            };
            break;
          case 'e-resize':
            xDiff = mouse.x - (table.x + table.width);
            cloneTable = {
              width: table.width += xDiff,
            };
            break;
          case 'w-resize':
            xDiff = table.x - mouse.x;
            cloneTable = {
              x: mouse.x,
              width: table.width += xDiff,
            };
            break;

        }

        if (!this.detectOutOfBounds(cloneTable,layoutState['ctx'])) {
          table = Object.assign(table, cloneTable);
        }
      }
    })

  }

  mouseHoverDetection(tables: Table[], mouse: Mouse) {

    tables.forEach(table => {

      if (mouse.y > table.y - 10 && mouse.y < table.y + 10 &&
        mouse.x > table.x + table.width - 10 && mouse.x < table.x + table.width + 10) {

        table.hovering = true;
        mouse.state = 'ne-resize'
        return;

      } else if (mouse.y > table.y + table.height - 10 && mouse.y < table.y + table.height + 10 &&
        mouse.x > table.x + table.width - 10 && mouse.x < table.x + table.width + 10) {

        table.hovering = true;
        mouse.state = 'se-resize'
        return;

      } else if (mouse.y > table.y - 10 && mouse.y < table.y + 10 &&
        mouse.x > table.x - 10 && mouse.x < table.x + 10) {

        table.hovering = true;
        mouse.state = 'nw-resize'
        return;

      } else if (mouse.y > table.y + table.height - 10 && mouse.y < table.y + table.height + 10 &&
        mouse.x > table.x - 10 && mouse.x < table.x + 10) {

        table.hovering = true;
        mouse.state = 'sw-resize'
        return;


      } else if (mouse.y > table.y - 10 && mouse.y < table.y + 10 &&
        mouse.x > table.x && mouse.x < table.x + table.width) {

        table.hovering = true;
        mouse.state = 'n-resize'
        return;


      } else if (mouse.x > table.x && mouse.x < table.x + table.width
        && mouse.y > table.y + table.height - 10 && mouse.y < table.y + table.height + 10) {

        table.hovering = true;
        mouse.state = 's-resize'
        return;


      } else if (mouse.x > table.x + table.width - 10 && mouse.x < table.x + table.width + 10 &&
        mouse.y > table.y && mouse.y < table.y + table.height) {

        table.hovering = true;
        mouse.state = 'e-resize'
        return;


      } else if (mouse.x > table.x - 10 && mouse.x < table.x + 10
        && mouse.y > table.y && mouse.y < table.y + table.height) {

        table.hovering = true;
        mouse.state = 'w-resize'
        return;


      } else if ((mouse.x >= table.x && mouse.x <= table.x + table.width) &&
        (mouse.y >= table.y && mouse.y <= table.y + table.height)) {

        table.hovering = true;
        mouse.state = 'move'
        return;

      }

      table.hovering = false;
    })

  }

}
