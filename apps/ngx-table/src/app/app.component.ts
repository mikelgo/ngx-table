import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import {
  Column,
  RowDefinition,
  CellRenderer,
  ColumnDefinition,
  HeaderColumns
} from './table/models/table-models';
import { TableConfig } from './table/models/table-config';
import { ExampleData, getTestdata } from './_example/example.model';
import { Datasource, TableDatasource } from './datasource/datasource';

@Component({
  selector: 'ngx-table-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngx-table';

  public headerDefinition: HeaderColumns = {
    headers: [
      { columnTitle: 'c1' },
      { columnTitle: 'c2' },
      { columnTitle: 'c3' },
      { columnTitle: 'c4' },
      { columnTitle: 'c5' }
    ]
  };

  // TODO check with CellRenderer
  // TODO check with custom template
  public dataColumnDefinition: ColumnDefinition = {
    columns: [
      { displayProperty: 'id' },
      { displayProperty: 'p1' },
      { displayProperty: 'p2' },
      { displayProperty: 'p3' },
      { displayProperty: 'p4' }
    ]
  };

  public testdata: ExampleData[] = getTestdata();
  public datasource: Datasource<ExampleData> = new TableDatasource<ExampleData>(
    this.testdata
  );

  tableConfig: TableConfig = {
    width: '400px',
    maxBodyHeight: '200px'
  };

  ngOnInit() {}

  getVal(element) {
    console.log(element);
    return element;
  }
}
