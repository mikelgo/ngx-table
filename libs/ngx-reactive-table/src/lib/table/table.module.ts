import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { BodyComponent } from './components/body/body.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RowComponent } from './components/row/row.component';
import { CellComponent } from './components/cell/cell.component';
import { InputCellRendererComponent } from './components/cell/cell-renderer/input-cell-renderer/input-cell-renderer.component';
import { TopInfobarComponent } from './components/infobar/top-infobar/top-infobar.component';
import { SharedModule } from '../shared/shared.module';
import { GhostBodyComponent } from './components/loading-elements/ghost-body/ghost-body.component';
import { GhostRowComponent } from './components/loading-elements/ghost-row/ghost-row.component';
import { ShowFooterDirective } from './directives/show-footer.directive';

const COMPONENTS = [
  TableComponent,
  BodyComponent,
  FooterComponent,
  HeaderComponent,
  RowComponent,
  CellComponent,
  InputCellRendererComponent,
  TopInfobarComponent,
  GhostBodyComponent,
  GhostRowComponent,
  ShowFooterDirective
];
const MODULES = [CommonModule, SharedModule];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  exports: [TableComponent, TopInfobarComponent, ShowFooterDirective],
  providers: []
})
export class TableModule {}
