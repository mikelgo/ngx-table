import {
  Component,
  OnInit,
  Input,
  HostBinding,
  OnDestroy
} from '@angular/core';
import { TitleColumn, DataColumn } from './models/table-models';
import { TableConfig } from './models/table-config';
import { DEFAULT_TABLE_CONFIG } from './config/table-config';
import { Subject, Observable } from 'rxjs';
import { TableBehavior } from './table-behavior';
import { TableStateService } from './services/table-state.service';
import { Datasource } from '../datasource/datasource';
import { DataRow } from './models/data-row.model';

@Component({
  selector: 'ngx-table-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableStateService]
})
export class TableComponent<T> implements OnInit, TableBehavior, OnDestroy {
  @Input() title: string = '';

  @Input() set tableConfig(arg: TableConfig) {
    this._tableConfig = arg;
    this.initalizeStyles(arg);
  }

  @Input() set headerDefinition(headerDefinition: TitleColumn[]) {
    if (headerDefinition) {
      this.stateService.setHeaderDefinition(headerDefinition);
    }
  }

  @Input() set dataColumnDefinition(arg: DataColumn[]) {
    if (arg) {
      this.stateService.setDataColumnDefinition(arg);
    }
  }

  @Input() set datasource(datasource: Datasource<T>) {
    if (datasource) {
      this.stateService.setDatasource(datasource);
    }
  }

  @HostBinding('style.width')
  tableWidth: string = DEFAULT_TABLE_CONFIG.width;

  private destroy$ = new Subject();
  private _tableConfig: TableConfig = null;

  public renderHeaders$: Observable<TitleColumn[]>;
  public renderRows$: Observable<DataRow[]>;
  public renderColumnCount$: Observable<number>;

  public hiddenColumns$: Observable<TitleColumn[]>;
  public hiddenColumnsCount$: Observable<number>;

  constructor(public stateService: TableStateService<T>) {}

  ngOnInit() {
    this.renderHeaders$ = this.stateService.renderHeaders$;
    this.renderRows$ = this.stateService.renderRows$;
    this.renderColumnCount$ = this.stateService.renderColumnCount$;
    this.hiddenColumns$ = this.stateService.hiddenColumns$;
    this.hiddenColumnsCount$ = this.stateService.hiddenColumnsCount$;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get tableConfig(): TableConfig {
    return this._tableConfig;
  }

  public onRowSelect(row: DataRow, rowIndex: number) {
    this.stateService.onRowSelect(row, rowIndex);
  }

  public getSelectedRows(): Observable<DataRow[]> {
    return this.stateService.selectedRows$;
  }

  public getSelectedRowsCount(): Observable<number> {
    return this.stateService.selectedRowsCount$;
  }

  public onColumnShow(column: TitleColumn): void {
    this.stateService.showHiddenColumn(column);
  }

  public onColumnHide(column: TitleColumn): void {
    this.stateService.hideColumn(column);
  }

  private initalizeStyles(config: TableConfig) {
    this.tableWidth = this.getTableWidth(config);
  }

  private getTableWidth(config: TableConfig): string {
    if (config && config.width) {
      return config.width;
    } else {
      return DEFAULT_TABLE_CONFIG.width;
    }
  }
}
