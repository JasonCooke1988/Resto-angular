import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor() {
  }

  detectOverlap(element: { x: number; width: any; y: number; height: any; },
                compare: { x: number; width: any; y: number; height: any; }) {
    return (element.x >= element.x + element.width || element.y >= compare.y + compare.height ||
      (element.x + element.width) <= compare.x || (element.y + element.height) <= compare.y)
  }
}
