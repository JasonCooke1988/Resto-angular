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


  init(canvas: HTMLElement) {

    let ctx = (<HTMLCanvasElement>canvas).getContext('2d')!;
    let layout = canvas!;

    let layoutState$ = of(new LayoutState(layout, ctx))
    layoutState$.subscribe(state => this.layoutSubject.next(state))

    let tables$ = createHttpObservable('/tables');
    tables$.subscribe(tables => {
      this.refresh();
      this.tableSubject.next(this.tablesCalcRelativeValues(tables))
      this.loading(false)
    })

  }

  loading(bool: boolean = true) {
    const layoutState = this.layoutSubject.getValue();
    this.layoutSubject.next({...layoutState, loading: bool})
  }

  saveTablesLocally(tables: Table[]) {
    this.tableSubject.next(tables);
  }

  calcLastTableId() {

    let tables = this.tableSubject.getValue();
    let tableId = 0;
    if (tables.length) {
      tables.sort((a, b) => {
        return a.tableId - b.tableId;
      })
      tableId = tables[tables.length - 1].tableId + 1;
    }
    return tableId

  }

  clearSelected() {

    const tables = this.tableSubject.getValue().map(table => Object.assign(table, {selected: false}));
    this.tableSubject.next(tables);

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

    return from(fetch('/api/save_tables', {
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


  updateMousePos(args: any) {

    args['mouse'].x = args['evt'].clientX - args['layoutState']['layout'].offsetLeft;
    args['mouse'].y = args['evt'].clientY - args['layoutState']['layout'].offsetTop;

    if (!args['layoutState']['isDragging'] && !args['layoutState']['addingTable']) {
      args['mouse'].state = 'default';
      this.mouseHoverDetection(args['mouse']);
    }

  }

  placeNewTable(tables: Table[], layoutState: LayoutState, newTable: Table, mouse: Mouse) {

    newTable = {...newTable, ...this.tableCalcRealPlacement(newTable, layoutState['layout'], mouse)}
    let table = this.tableCalcRelativeValues(newTable)
    tables.push(table);

    return table;
  }

  editTablePlaceSize(event: Event, tables: Table[], layoutState: any, mouse: Mouse) {

    this.tableSubject.next(
      tables.map(table => {
        if (table.hovering && table.selected) {

          const tableX = Math.floor(mouse.x / layoutState['layout'].clientWidth * 100);
          const tableY = Math.floor(mouse.y / layoutState['layout'].clientHeight * 100);
          /*          const tableWidth = Math.floor(table.width / layoutState['layout'].clientWidth * 100);
                    const tableHeight = Math.floor(table.height / layoutState['layout'].clientHeight * 100);*/

          let cloneTable = {...table},
            yDiff,
            xDiff;

          switch (mouse.state) {
            case 'move':
              cloneTable = {
                ...cloneTable, ...{
                  x: tableX - table.width / 2,
                  y: tableY - table.height / 2
                }
              };
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

          // If moved table overlaps or is out of bounds of canvas return table data before movement was made
          if (this.detectOutOfBounds(cloneTable, layoutState['layout']) || this.detectOverlap(cloneTable, tables)) {
            // console.error('out of bounds or overlap detected')
            return this.tableCalcRelativeValues(table);
          }

          //Update table with new data and set the save state to not saved
          layoutState.saveState = 'notSaved';
          return this.tableCalcRelativeValues({...table, ...cloneTable})

        }
        return table;
      })
    )

  }


  detectOverlap(table: Table, tables: Table[]) {

    for (let i = 0; i < tables.length; i++) {
      if (table.tableId != tables[i].tableId) {
        if (((table.x < tables[i].x + tables[i].width &&
          table.x + table.width > tables[i].x &&
          table.y < tables[i].y + tables[i].height &&
          table.height + table.y > tables[i].y) && table.height >= 1 && table.width >= 1)) {
          return true
        }
      }
    }

    return false

  }

  detectOutOfBounds(element: any, canvas: any) {

    return (element.x < 1 || element.y < 1 || element.calcX + element.calcWidth > canvas.width - 1 || element.calcY + element.calcHeight > canvas.height - 1);

  }

  mouseHoverDetection(mouse: Mouse) {

    let tables = this.tableSubject.getValue();

    const margin = 10;

    for (let i = 0; i < tables.length; i++) {

      const tableRight = tables[i].calcX + tables[i].calcWidth;
      const tableBottom = tables[i].calcY + tables[i].calcHeight;

      //If mouse is inside tables border + $margin
      if (mouse.y > tables[i].calcY - margin && mouse.y < tableBottom + margin &&
        mouse.x > tables[i].calcX - margin && mouse.x < tableRight + margin) {

        tables[i].hovering = true;

        //Is mouse no more than $margin away from table top border
        //Start check all top resizes
        if (mouse.y < tables[i].calcY + margin) {

          //top right resize
          if (mouse.x > tableRight - margin && mouse.x < tableRight + margin) {
            mouse.state = 'ne-resize'
            break;
          }
          //top left resize
          else if (mouse.x > tables[i].calcX - margin && mouse.x < tables[i].calcX + margin) {
            mouse.state = 'nw-resize'
            break;
          }
          //top resize
          mouse.state = 'n-resize'
          break;
        }
        //Is mouse on bottom table border
        else if (mouse.y > tableBottom - margin) {
          //Bottom left resize
          if (mouse.x > tables[i].calcX - margin && mouse.x < tables[i].calcX + margin) {
            mouse.state = 'sw-resize'
            break;
          }
          //Bottom right resize
          else if (mouse.x > tableRight - margin && mouse.x < tableRight + margin) {
            mouse.state = 'se-resize'
            break;
          }

          //Bottom resize
          mouse.state = 's-resize'
          break;

          //  Right resize
        } else if (mouse.x > tables[i].calcX - 10 && mouse.x < tables[i].calcX + 10) {

          tables[i].hovering = true;
          mouse.state = 'w-resize'
          break;

          //Left resize
        } else if (mouse.x > tableRight - 10 && mouse.x < tableRight + 10) {

          tables[i].hovering = true;
          mouse.state = 'e-resize'
          break;

          //Else cursor is not on borders so move is assigned
        } else {

          mouse.state = 'move'
          break;

        }

      }

      tables[i].hovering = false;

    }

  }

  togglePlacingNewTable() {

    const layoutState = this.layoutSubject.getValue();
    this.layoutSubject.next({...layoutState, placingNewTable: !layoutState.placingNewTable})

  }

  toggleIsSaved(override: string = '') {

    const layoutState = this.layoutSubject.getValue();
    let newState = override != '' ? override : layoutState.saveState === 'saved' ? 'notSaved' : 'saved';
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
  }

  tableCalcRelativeValues(table: Table) {
    //Calc real values of tables from canvas element
    const layout = this.layoutSubject.getValue().layout;

    return {...table, ...{
      calcX: layout.clientWidth / 100 * table.x,
      calcY: layout.clientHeight / 100 * table.y,
      calcHeight: layout.clientHeight / 100 * table.height,
      calcWidth: layout.clientWidth / 100 * table.width
    }}
  }

  tablesCalcRelativeValues(tables: Table[]) {

    //Calc real values of tables from canvas element
    for (let i = 0; i < tables.length; i++) {
      tables[i] = this.tableCalcRelativeValues(tables[i])
    }

    return tables;
  }

  tableCalcRealPlacement(table: Table, layout: HTMLElement, mouse: Mouse) {
    return {
      ...table, ...{
        x: Math.floor(mouse.x / layout.clientWidth * 100),
        y: Math.floor(mouse.y / layout.clientHeight * 100),
      }
    }
  }

}
