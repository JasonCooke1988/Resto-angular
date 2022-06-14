import {Injectable} from '@angular/core';
import {Table} from "../models/table.model";
import {Mouse} from "../models/mouse.model";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  detectOutOfBounds(element: any, canvas: any) {
    return (element.x < 10 || element.y < 10 || element.x + element.width > canvas.width - 10 || element.y + element.height > canvas.height - 10);
  }

  updateMousePos(args: any) {

    args['mouse'].x = args['evt'].clientX - args['layoutState']['layout'].offsetLeft;
    args['mouse'].y = args['evt'].clientY - args['layoutState']['layout'].offsetTop;

    if (!args['layoutState']['dragging'] && !args['layoutState']['addingTable']) {
      args['mouse'].state = 'default';
      this.mouseHoverDetection(args['tables'], args['mouse']);
    }

  }

  placeNewTable(event: Event, tables: Table[], layoutState: any, mouse: Mouse, newTable: Table) {

    tables.push(Object.assign(newTable, {
      x: mouse.x,
      y: mouse.y
    }));

  }

  editTablePlaceSize(event: Event, tables: Table[], layoutState: any, mouse: Mouse) {

    tables.forEach(table => {
      if (table.hovering && table.selected) {

        let cloneTable = {...table},
          yDiff,
          xDiff;

        switch (mouse.state) {
          case 'move':
            cloneTable = Object.assign(cloneTable,{
              x: mouse.x - table.width / 2,
              y: mouse.y - table.height / 2
            });
            break;
          case 'ne-resize':
            yDiff = cloneTable.y - mouse.y;
            xDiff = mouse.x - (cloneTable.x + cloneTable.width);
            cloneTable = Object.assign(cloneTable, {
              y: mouse.y,
              height: cloneTable.height += yDiff,
              width: cloneTable.width += xDiff
            });
            break;
          case 'nw-resize':
            yDiff = cloneTable.y - mouse.y;
            xDiff = cloneTable.x - mouse.x;
            cloneTable = Object.assign(cloneTable, {
              y: mouse.y,
              x: mouse.x,
              height: cloneTable.height += yDiff,
              width: cloneTable.width += xDiff
            });
            break;
          case 'se-resize':
            yDiff = mouse.y - (cloneTable.y + cloneTable.height);
            xDiff = mouse.x - (cloneTable.x + cloneTable.width);
            cloneTable = Object.assign(cloneTable, {
              height: cloneTable.height += yDiff,
              width: cloneTable.width += xDiff
            });
            break;
          case 'sw-resize':
            yDiff = mouse.y - (cloneTable.y + cloneTable.height);
            xDiff = cloneTable.x - mouse.x;
            cloneTable = Object.assign(cloneTable, {
              x: mouse.x,
              height: cloneTable.height += yDiff,
              width: cloneTable.width += xDiff
            });
            break;
          case 'n-resize':
            yDiff = cloneTable.y - mouse.y;
            cloneTable = Object.assign(cloneTable, {
              y: mouse.y,
              height: cloneTable.height += yDiff,
            });
            break;
          case 's-resize':
            yDiff = mouse.y - (cloneTable.y + cloneTable.height);
            cloneTable = Object.assign(cloneTable, {
              height: cloneTable.height += yDiff,
            });
            break;
          case 'e-resize':
            xDiff = mouse.x - (cloneTable.x + cloneTable.width);
            cloneTable = Object.assign(cloneTable, {
              width: cloneTable.width += xDiff,
            });
            break;
          case 'w-resize':
            xDiff = cloneTable.x - mouse.x;
            cloneTable = Object.assign(cloneTable, {
              x: mouse.x,
              width: cloneTable.width += xDiff,
            });
            break;

        }

        if ((!this.detectOutOfBounds(cloneTable, layoutState['ctx'])) && cloneTable.width >= 50 && cloneTable.height >= 50) {
          table = Object.assign(table,cloneTable);
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
