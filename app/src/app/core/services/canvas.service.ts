import {Table} from "../models/table.model";
import {Mouse} from "../models/mouse.model";
import {BehaviorSubject, from, Observable, of} from "rxjs";
import {LayoutState} from "../models/layoutState.model";
import {createHttpObservable} from "./util";

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
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
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
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
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
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.error('Request failed with status code: ' + response.status)
        return {error: 'Request failed with status code: ' + response.status}
      }
    }).catch(e => console.error(e)))
  }

  updateLayout(layoutState: LayoutState) {
    this.layoutSubject.next(layoutState)
  }

  drawTables(ctx: CanvasRenderingContext2D, layout: HTMLElement, tables: Table[]) {

    tables.forEach(table => {

      ctx.beginPath()
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 3.5;
      ctx.fillStyle = "rgba(75,57,44,0.70)";
      ctx.fillRect(
        table.calcX,
        table.calcY,
        table.calcWidth,
        table.calcHeight
      );

      if (table.tableNumber) {
        ctx.font = "15px roboto";
        ctx.fillStyle = 'black';
        let text = table.tableNumber.toString();
        let textMeasure = ctx.measureText(text);
        ctx.fillText(text, table.calcX + (table.calcWidth / 2) - (textMeasure.width / 2), table.calcY + (table.calcHeight / 2) + 3.5)
      }

      if (table.selected) {
        ctx.strokeStyle = '#0677D7';
        ctx.lineWidth = 2.5;
        ctx.rect(
          table.calcX,
          table.calcY,
          table.calcWidth,
          table.calcHeight
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
        if ((!(table.calcX < compare.calcX + compare.calcWidth &&
          table.calcX + table.calcWidth > compare.calcX &&
          table.calcY < compare.calcY + compare.calcHeight &&
          table.calcHeight + table.calcY > compare.calcY) && table.calcHeight >= 1 && table.calcWidth >= 1)) {
          count++;
        }
      } else {
        count++;
      }
    })

    return count != tables.length;
  }

  detectOutOfBounds(element: any, canvas: any) {
    return (element.calcX < 10 || element.calcY < 10 || element.calcX + element.calcWidth > canvas.width - 10 || element.calcY + element.calcHeight > canvas.height - 10);
  }

  updateMousePos(args: any) {

    args['mouse'].x = args['evt'].clientX - args['layoutState']['layout'].offsetLeft;
    args['mouse'].y = args['evt'].clientY - args['layoutState']['layout'].offsetTop;

    if (!args['layoutState']['isDragging'] && !args['layoutState']['addingTable']) {
      args['mouse'].state = 'default';
      this.mouseHoverDetection(args['tables'], args['mouse'], args['layoutState']['layout']);
    }

  }

  placeNewTable(event: Event, tables: Table[], layoutState: LayoutState, mouse: Mouse, newTable: Table) {

    newTable = {
      ...newTable, ...this.relativeSizeAndPlacement(newTable, mouse, layoutState['layout'])
    }

    console.log(newTable)

    let table = this.tablesCalcRealSizeAndPlace(newTable, layoutState['layout'])

    tables.push(table);

    return table;
  }

  relativeSizeAndPlacement(table: Table, mouse: Mouse, layout: HTMLElement) {
    return {
      x: Math.floor(mouse.x / layout.clientWidth * 100),
      y: Math.floor(mouse.y / layout.clientHeight * 100),
      width: Math.floor(50 / layout.clientWidth * 100),
      height: Math.floor(50 / layout.clientHeight * 100)
    }
  }

  editTablePlaceSize(event: Event, tables: Table[], layoutState: any, mouse: Mouse) {

    this.tableSubject.next(
      tables.map(table => {
        if (table.hovering && table.selected) {

          const tableX = Math.floor(mouse.x / layoutState['layout'].clientWidth * 100);
          const tableY = Math.floor(mouse.y / layoutState['layout'].clientHeight * 100);
          const tableWidth = Math.floor(table.width / layoutState['layout'].clientWidth * 100);
          const tableHeight = Math.floor(table.height / layoutState['layout'].clientHeight * 100);

          let cloneTable = {...table},
            yDiff,
            xDiff;

          switch (mouse.state) {
            case 'move':
              cloneTable = Object.assign(cloneTable, {
                x: tableX - table.width / 2,
                y: tableY - table.height / 2
              });
              break;
            case 'ne-resize':
              yDiff = cloneTable.y - tableY;
              xDiff = tableX - (cloneTable.x + cloneTable.width);
              cloneTable = Object.assign(cloneTable, {
                y: tableY,
                height: cloneTable.height += yDiff,
                width: cloneTable.width += xDiff
              });
              break;
            case 'nw-resize':
              yDiff = cloneTable.y - tableY;
              xDiff = cloneTable.x - tableX;
              cloneTable = Object.assign(cloneTable, {
                y: tableY,
                x: tableX,
                height: cloneTable.height += yDiff,
                width: cloneTable.width += xDiff
              });
              break;
            case 'se-resize':
              yDiff = tableY - (cloneTable.y + cloneTable.height);
              xDiff = tableX - (cloneTable.x + cloneTable.width);
              cloneTable = Object.assign(cloneTable, {
                height: cloneTable.height += yDiff,
                width: cloneTable.width += xDiff
              });
              break;
            case 'sw-resize':
              yDiff = tableY - (cloneTable.y + cloneTable.height);
              xDiff = cloneTable.x - tableX;
              cloneTable = Object.assign(cloneTable, {
                x: tableX,
                height: cloneTable.height += yDiff,
                width: cloneTable.width += xDiff
              });
              break;
            case 'n-resize':
              yDiff = cloneTable.y - tableY;
              cloneTable = Object.assign(cloneTable, {
                y: tableY,
                height: cloneTable.height += yDiff,
              });
              break;
            case 's-resize':
              yDiff = tableY - (cloneTable.y + cloneTable.height);
              cloneTable = Object.assign(cloneTable, {
                height: cloneTable.height += yDiff,
              });
              break;
            case 'e-resize':
              xDiff = tableX - (cloneTable.x + cloneTable.width);
              cloneTable = Object.assign(cloneTable, {
                width: cloneTable.width += xDiff,
              });
              break;
            case 'w-resize':
              xDiff = cloneTable.x - tableX;
              cloneTable = Object.assign(cloneTable, {
                x: tableX,
                width: cloneTable.width += xDiff,
              });
              break;

          }

          if (!this.detectOutOfBounds(cloneTable, layoutState['layout']) && !this.detectOverlap(cloneTable, tables)
            && cloneTable.width >= 1 && cloneTable.height >= 1) {
            layoutState.saveState = 'notSaved';
            return this.tablesCalcRealSizeAndPlace({...table, ...cloneTable}, layoutState['layout'])
          }
        }
        return table;
      })
    )

  }

  mouseHoverDetection(tables: Table[], mouse: Mouse, layout: HTMLElement) {

    tables.forEach(table => {

      if (mouse.y > table.calcY - 10 && mouse.y < table.calcY + 10 &&
        mouse.x > table.calcX + table.calcWidth - 10 && mouse.x < table.calcX + table.calcWidth + 10) {

        table.hovering = true;
        mouse.state = 'ne-resize'
        return;

      } else if (mouse.y > table.calcY + table.calcHeight - 10 && mouse.y < table.calcY + table.calcHeight + 10 &&
        mouse.x > table.calcX + table.calcWidth - 10 && mouse.x < table.calcX + table.calcWidth + 10) {

        table.hovering = true;
        mouse.state = 'se-resize'
        return;

      } else if (mouse.y > table.calcY - 10 && mouse.y < table.calcY + 10 &&
        mouse.x > table.calcX - 10 && mouse.x < table.calcX + 10) {

        table.hovering = true;
        mouse.state = 'nw-resize'
        return;

      } else if (mouse.y > table.calcY + table.calcHeight - 10 && mouse.y < table.calcY + table.calcHeight + 10 &&
        mouse.x > table.calcX - 10 && mouse.x < table.calcX + 10) {

        table.hovering = true;
        mouse.state = 'sw-resize'
        return;


      } else if (mouse.y > table.calcY - 10 && mouse.y < table.calcY + 10 &&
        mouse.x > table.calcX && mouse.x < table.calcX + table.calcWidth) {

        table.hovering = true;
        mouse.state = 'n-resize'
        return;


      } else if (mouse.x > table.calcX && mouse.x < table.calcX + table.calcWidth
        && mouse.y > table.calcY + table.calcHeight - 10 && mouse.y < table.calcY + table.calcHeight + 10) {

        table.hovering = true;
        mouse.state = 's-resize'
        return;


      } else if (mouse.x > table.calcX + table.calcWidth - 10 && mouse.x < table.calcX + table.calcWidth + 10 &&
        mouse.y > table.calcY && mouse.y < table.calcY + table.calcHeight) {

        table.hovering = true;
        mouse.state = 'e-resize'
        return;


      } else if (mouse.x > table.calcX - 10 && mouse.x < table.calcX + 10
        && mouse.y > table.calcY && mouse.y < table.calcY + table.calcHeight) {

        table.hovering = true;
        mouse.state = 'w-resize'
        return;


      } else if ((mouse.x >= table.calcX && mouse.x <= table.calcX + table.calcWidth) &&
        (mouse.y >= table.calcY && mouse.y <= table.calcY + table.calcHeight)) {

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

    this.layoutSubject.next(layoutState)

    //Calc real values of tables from canvas element
    const tables = this.tableSubject.getValue();
    const newTables = tables.map(table => table = {
      ...table, ...{
        calcX: layoutState['layout'].clientWidth / 100 * table.x,
        calcY: layoutState['layout'].clientHeight / 100 * table.y,
        calcHeight: layoutState['layout'].clientHeight / 100 * table.height,
        calcWidth: layoutState['layout'].clientWidth / 100 * table.width
      }
    });
    this.tableSubject.next(newTables);

  }

  tablesCalcRealSizeAndPlace(table: Table, layout: HTMLElement) {
    return {
      ...table, ...{
        calcX: layout.clientWidth / 100 * table.x,
        calcY: layout.clientHeight / 100 * table.y,
        calcHeight: layout.clientHeight / 100 * table.height,
        calcWidth: layout.clientWidth / 100 * table.width
      }
    }

  }

}
