import { Component, OnInit, Input } from '@angular/core';

import { CellRenderer } from '../../models/cell-renderer-types';
import { Cell } from '../../models/cell.model';

@Component({
  selector: 'ngx-table-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {
  private _cell: Cell = null;
  @Input() set cell(cell: Cell) {
    if (cell) {
      // console.log(cell);
      this._cell = cell;
    }
  }

  get cell() {
    return this._cell;
  }
  constructor() {}

  ngOnInit() {}

  getCellRendererType(): CellRenderer {
    if (this.cell.cellRenderer) {
      return this.cell.cellRenderer;
    }
  }
}
