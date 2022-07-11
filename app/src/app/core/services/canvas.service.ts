import {Injectable} from '@angular/core';
import {Table} from "../models/table.model";
import {Mouse} from "../models/mouse.model";
import {BehaviorSubject, from, Observable, of} from "rxjs";
import {LayoutState} from "../models/layoutState.model";
import {createHttpObservable} from "./util";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  private layoutSubject = new BehaviorSubject(<LayoutState>({}))
  layoutState$: Observable<LayoutState> = this.layoutSubject.asObservable();

  private tableSubject = new BehaviorSubject(<Table[]>([]))
  tables$: Observable<Table[]> = this.tableSubject.asObservable();


  init() {

    const tables$ = createHttpObservable('/tables');
    tables$.subscribe(tables => this.tableSubject.next(tables))

    const ctx = (<HTMLCanvasElement>document.getElementById('canvas')).getContext('2d')!;
    const layout = document.getElementById('canvas')!;

    const layoutState$ = of(new LayoutState(layout, ctx))
    layoutState$.subscribe(state => this.layoutSubject.next(state))

  }

  saveTablesLocally(tables: Table[]) {
    this.tableSubject.next(tables);
  }

  addTableRemote(table: Table) {
    fetch(`/api/add_table`, {
      method: 'POST',
      body: JSON.stringify(table),
      headers: {
        'content-type': 'application/json'
      }
    }).then(r => console.log('new table saved'))
  }

  modifyTable(selectedTable: Table) {
    fetch('/api/save_table', {
      method: 'PUT',
      body: JSON.stringify(selectedTable),
      headers: {
        'content-type': 'application/json'
      }
    }).then( response => {
      if(response.ok) {
        return response.json();
      }  else{
        console.error('Request failed with status code: ' + response.status)
        return {error: 'Request failed with status code: ' + response.status}
      }
    }).catch(e => console.error(e))
  }

  clearSelected() {

    const tables = this.tableSubject.getValue();
    const newTables = tables.map(table => table = {...table, ...{selected: false}});
    this.tableSubject.next(newTables);

  }

  deleteTable(selectedTable: Table) {

    const tables = this.tableSubject.getValue();

    this.layoutSaving()

    const newTables = tables.filter(table => table.tableId != selectedTable.tableId);
    this.tableSubject.next(newTables);

    return from(fetch('/api/delete_table', {
      method: 'DELETE',
      body: JSON.stringify(selectedTable),
      headers: {
        'content-type': 'application/json'
      }
    }).then( response => {
      if(response.ok) {
        return response.json();
      }  else{
        console.error('Request failed with status code: ' + response.status)
        return {error: 'Request failed with status code: ' + response.status}
      }
    }).catch(e => console.error(e)))


  }

  saveLayout() {
    const tables = this.tableSubject.getValue();

    this.layoutSaving();

    return from(fetch('/api/save_all_tables', {
      method: 'PUT',
      body: JSON.stringify(tables),
      headers: {
        'content-type': 'application/json'
      }
    }).then( response => {
      if(response.ok) {
        return response.json();
      }  else{
        console.error('Request failed with status code: ' + response.status)
        return {error: 'Request failed with status code: ' + response.status}
      }
    }).catch(e => console.error(e)))
  }

  updateLayout(layoutState: LayoutState) {
    this.layoutSubject.next(layoutState)
  }

  drawTables(ctx: CanvasRenderingContext2D, tables: Table[]) {

    tables.forEach(table => {
      ctx.beginPath()
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 3.5;
      ctx.fillStyle = "rgba(75,57,44,0.70)";
      ctx.fillRect(
        table.x,
        table.y,
        table.width,
        table.height
      );

      if (table.tableNumber) {
        ctx.font = "15px roboto";
        ctx.fillStyle = 'black';
        let text = table.tableNumber.toString();
        let textMeasure = ctx.measureText(text);
        ctx.fillText(text, table.x + (table.width / 2) - (textMeasure.width / 2), table.y + (table.height / 2) + 3.5)
      }

      if (table.selected) {
        ctx.strokeStyle = '#0677D7';
        ctx.lineWidth = 2.5;
        ctx.rect(
          table.x,
          table.y,
          table.width,
          table.height
        );
        ctx.stroke();
        ctx.closePath();
      }
    });
  }

  detectOverlap(table: Table, tables: Table[]) {

    let count = 0;

    tables.forEach(compare => {
      if (table.tableId != compare.tableId) {
        if ((!(table.x < compare.x + compare.width &&
          table.x + table.width > compare.x &&
          table.y < compare.y + compare.height &&
          table.height + table.y > compare.y) && table.height >= 50 && table.width >= 50)) {
          count++;
        }
      } else {
        count++;
      }
    })

    return count != tables.length;
  }

  detectOutOfBounds(element: any, canvas: any) {
    return (element.x < 10 || element.y < 10 || element.x + element.width > canvas.width - 10 || element.y + element.height > canvas.height - 10);
  }

  updateMousePos(args: any) {

    args['mouse'].x = args['evt'].clientX - args['layoutState']['layout'].offsetLeft;
    args['mouse'].y = args['evt'].clientY - args['layoutState']['layout'].offsetTop;

    if (!args['layoutState']['isDragging'] && !args['layoutState']['addingTable']) {
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
            cloneTable = Object.assign(cloneTable, {
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

        if (!this.detectOutOfBounds(cloneTable, layoutState['layout']) && !this.detectOverlap(cloneTable, tables)
          && cloneTable.width >= 50 && cloneTable.height >= 50) {
          layoutState.saveState = 'notSaved';
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

  togglePlacingNewTable() {

    const layoutState = this.layoutSubject.getValue();
    this.layoutSubject.next({...layoutState, placingNewTable: !layoutState.placingNewTable})

  }

  toggleIsSaved() {

    const layoutState = this.layoutSubject.getValue();
    let newState = layoutState.saveState === 'saved' ? 'notSaved' : 'saved';
    this.layoutSubject.next({...layoutState, saveState: newState})

  }

  isSaved() {
    const layoutState = this.layoutSubject.getValue();
    return layoutState.saveState;
  }

  layoutSaving() {
    const layoutState = this.layoutSubject.getValue();
    this.layoutSubject.next({...layoutState, saveState: 'saving'})
  }

  refresh() {
    let canvasWrap = document.getElementById('canvas-wrap');
    let canvasWrapWidth = canvasWrap!.clientWidth;
    let canvasWrapHeight = canvasWrap!.clientHeight;

    const layoutState = this.layoutSubject.getValue();
    layoutState.ctx.canvas.width = canvasWrapWidth;
    layoutState.ctx.canvas.height = canvasWrapHeight;
    layoutState.ctx.translate(canvasWrapWidth / canvasWrapWidth, canvasWrapHeight / canvasWrapHeight);

    this.layoutSubject.next(layoutState)
  }
}
