import { TableConfig } from '../models/table-config';
import { HeaderConfig } from '../models/header-config';
import { TitlePositions } from '../models/title-positions';
import { RowConfig } from '../models/row-config';

export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  titleRowHeight: '50px',
  titlePositioning: TitlePositions.CENTER_CENTER
};

export const DEFAULT_ROW_CONFIG: RowConfig = {
  style: 'wide',
  striped: false,
  height: '35px',
  backgroundColor: 'white',
  borderBottomStyle: '1px solid #ccc',
  borderTopStyle: '1px solid transparent'
};

export const DEFAULT_TABLE_CONFIG: TableConfig = {
  headerConfig: DEFAULT_HEADER_CONFIG,
  rowConfig: DEFAULT_ROW_CONFIG,
  width: '100%',
  maxBodyHeight: '300px',
  defaultColumnWidth: '1fr'
};
