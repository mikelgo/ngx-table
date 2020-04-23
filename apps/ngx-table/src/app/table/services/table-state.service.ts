import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import {
  RowDefinition,
  DataRow,
  Cell,
  TitleColumn,
  DataColumn
} from '../models/table-models';
import {
  map,
  filter,
  tap,
  takeUntil,
  distinctUntilChanged
} from 'rxjs/operators';
import { Datasource } from '../../datasource/datasource';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class TableStateService<T> implements OnDestroy {
  private destroy$ = new Subject();
  private headerDefinition = new BehaviorSubject<TitleColumn[]>(null);
  private dataColumnDefinition = new BehaviorSubject<DataColumn[]>(null);
  private datasource = new BehaviorSubject<Datasource<T>>(null);

  // TODO the grid template columns must be adapted
  private headerDefinition$: Observable<
    TitleColumn[]
  > = this.headerDefinition.asObservable().pipe(
    filter(v => v !== null),
    distinctUntilChanged()
  );

  private dataColumnDefinition$: Observable<
    DataColumn[]
  > = this.dataColumnDefinition.asObservable().pipe(
    filter(v => v !== null),
    distinctUntilChanged()
  );

  private renderDataColumns$: Observable<DataColumn[]>;

  private datasource$: Observable<
    Datasource<T>
  > = this.datasource.asObservable().pipe(
    filter(v => v !== null),
    distinctUntilChanged()
  );

  private selectedRows: RowDefinition[] = [];
  private selectedRowsCache$$ = new BehaviorSubject<RowDefinition[]>(null);
  public selectedRows$ = this.selectedRowsCache$$.asObservable();
  public selectedRowsCount$: Observable<number> = this.selectedRows$.pipe(
    filter(values => values !== null),
    map(values => values.length)
  );

  private lastSelectedRowCache$$ = new BehaviorSubject<RowDefinition>(null);
  public lastSelectedRow$ = this.lastSelectedRowCache$$.asObservable();

  public rows$: Observable<DataRow[]> = combineLatest([
    this.headerDefinition$,
    this.dataColumnDefinition$,
    this.datasource$
  ]).pipe(
    map(([headerDefinition, columnDefinition, datasource]) =>
      this.mapColumnDefinitionToRowDefinition(
        headerDefinition,
        columnDefinition,
        datasource
      )
    ),
    distinctUntilChanged()
  );

  // TODO onCOlumnHideChangeClick$$ = hier rein mergen und dann column definition anpassen
  public renderHeaderDefinitions$: Observable<
    TitleColumn[]
  > = this.headerDefinition
    .asObservable()
    .pipe(map(titleColumns => titleColumns.filter(c => !c.hide)));

  private initialization$: Observable<
    [Datasource<T>, TitleColumn[], DataColumn[]]
  >;
  // THOSE WILL BE USED IN TABLE
  public renderHeaders$: Observable<TitleColumn[]>;
  public renderRows$: Observable<DataRow[]>;

  constructor() {
    this.renderDataColumns$ = combineLatest([
      this.dataColumnDefinition$,
      this.headerDefinition$
    ]).pipe(
      map(([dataColumnDefinition, headerDefinition]) =>
        this.updateDataColumns(dataColumnDefinition, headerDefinition)
      ),
      distinctUntilChanged()
    );

    this.initialization$ = combineLatest([
      this.datasource$,
      this.headerDefinition$,
      this.dataColumnDefinition$
    ]);

    this.renderHeaders$ = this.initialization$.pipe(
      map(
        ([datasource, headerDefinition, dataColumnDefinition]) =>
          headerDefinition
      ),
      map(titleColumns => titleColumns.filter(c => !c.hide))
    );

    this.renderRows$ = this.initialization$.pipe(
      map(([datasource, headerDefinition, dataColumnDefinition]) =>
        this.mapColumnDefinitionToRowDefinition(
          headerDefinition,
          dataColumnDefinition,
          datasource
        )
      )
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.headerDefinition.complete();
    this.dataColumnDefinition.complete();
    this.datasource.complete();

    this.selectedRows = [];
    this.selectedRowsCache$$.complete();
    this.lastSelectedRowCache$$.complete();
  }

  public onRowSelect(row: RowDefinition, rowIndex: number): void {
    if (!this.selectedRows.includes(row)) {
      this.selectedRows.push(row);
      this.selectedRowsCache$$.next(this.selectedRows);
    } else {
      const index = this.selectedRows.indexOf(row);
      this.selectedRows.splice(index, 1);
      this.selectedRowsCache$$.next(this.selectedRows);
    }

    this.lastSelectedRowCache$$.next(row);
  }

  public setHeaderDefinition(headerDefinition: TitleColumn[]): void {
    const headers: TitleColumn[] = [...headerDefinition];
    headers.forEach((header, index) => {
      header.id = header.id ? header.id : this.getID();
      header.index = index;
      header.hide = header.hide ? header.hide : false;
    });

    // TODO check if incoming headerDefinition has ID - if all are unique otherwise throw error!
    this.headerDefinition.next(headers);
  }

  public getHeaderDefinition(): TitleColumn[] {
    return this.headerDefinition.getValue();
  }

  public setDataColumnDefinition(dataColumnDefinition: DataColumn[]): void {
    this.dataColumnDefinition.next(dataColumnDefinition);
  }

  public getDataColumnDefinition(): DataColumn[] {
    return this.dataColumnDefinition.getValue();
  }

  public setDatasource(datasource: Datasource<T>): void {
    this.datasource.next(datasource);
  }

  public getDatasource(): Datasource<T> {
    return this.datasource.getValue();
  }

  private mapColumnDefinitionToRowDefinition(
    headerDefinition: TitleColumn[],
    columnDefinition: DataColumn[],
    datasource: Datasource<T>
  ): DataRow[] {
    const rows: DataRow[] = [];
    if (columnDefinition && datasource && headerDefinition) {
      datasource.getData().forEach((row, index) => {
        rows.push({
          index: index,
          values: this.getRowValues(row, headerDefinition, columnDefinition)
        });
      });
    }
    return rows;
  }

  private getRowValues(
    row: T,
    headerDefinition: TitleColumn[],
    columnDefinition: DataColumn[]
  ): Cell[] {
    const values: Cell[] = [];
    // TODO here the hide must be applied
    columnDefinition.forEach((column, index) => {
      if (!headerDefinition[index].hide) {
        // if (!column.hide) {
        values.push({
          val: row[column.displayProperty],
          cellRenderer: column.cellRenderer ? column.cellRenderer : null,
          template: column.template ? column.template : null,
          cssClass: column.class ? column.class : null
        });
      }
    });
    return values;
  }

  private getID(): string {
    return uuidv4();
  }

  private updateDataColumns(
    dataColumnDefinition: DataColumn[],
    headerDefinition: TitleColumn[]
  ) {
    const dataColumns: DataColumn[] = [...dataColumnDefinition];

    headerDefinition.forEach((h, index) => {
      dataColumns[h.index] = {
        ...dataColumns[index],
        id: h.id ? h.id : null,
        hide: h.hide ? h.hide : false
      };
    });

    return dataColumns;
  }
}
