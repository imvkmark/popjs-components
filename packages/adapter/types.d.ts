export type Size = 'small' | 'default' | 'large';

export function size(s: Size): string;

export type ClassValue = string | undefined | { [key: string]: any } | ClassValue[];
export type StyleValue = string | CSSProperties;

export interface CommonProps {
  class?: ClassValue;
  style?: StyleValue;
}

export interface ButtonProps {
  size?: string;
  disabled?: boolean;
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text';
  icon?: any;
  nativeType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  loadingIcon?: any;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  bg?: boolean;
  autofocus?: boolean;
  round?: boolean;
  circle?: boolean;
  color?: string;
  dark?: boolean;
  autoInsertSpace?: boolean;
  onClick?: ((evt: MouseEvent) => any) | undefined;
}
export const Button: (props: ButtonProps) => any;

export const Alert: any;
export const Pagination: any;

export type SortOrder = 'ascending' | 'descending';

export type FilterList = { text: string; value: any }[];

export interface Sort {
  prop: string;
  order: SortOrder;
  init?: any;
  silent?: any;
}

export interface TableProps {
  data?: any[];
  size?: string;
  width?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  fit?: boolean;
  stripe?: boolean;
  border?: boolean;
  rowKey?: string | ((row: any) => string);
  showHeader?: boolean;
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?: (data: { columns: any; data: any[] }) => string[];
  rowClassName?: ClassValue;
  rowStyle?: StyleValue;
  cellClassName?: ClassValue | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => ClassValue);
  cellStyle?: StyleValue | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => StyleValue);
  headerRowClassName?: ClassValue;
  headerRowStyle?: StyleValue;
  headerCellClassName?:
    | ClassValue
    | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => ClassValue);
  headerCellStyle?:
    | StyleValue
    | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => StyleValue);

  highlightCurrentRow?: boolean;
  currentRowKey?: string | number;
  emptyText?: string;
  expandRowKeys?: any[];
  defaultExpandAll?: boolean;
  defaultSort?: Sort;
  tooltipEffect?: string;
  spanMethod?: (data: { row: any; rowIndex: number; column: any; columnIndex: number }) =>
    | number[]
    | {
        rowspan: number;
        colspan: number;
      }
    | undefined;
  selectOnIndeterminate?: boolean;
  indent?: number;
  treeProps?: any;
  lazy?: boolean;
  load?: (row: any, treeNode: any, resolve: (data: any[]) => void) => void;
  style?: StyleValue;
  className?: ClassValue;
  tableLayout?: 'auto' | 'fixed';
  scrollbarAlwaysOn?: boolean;
  flexible?: boolean;

  onSelect?: (...args: any[]) => any;
  onExpandChange?: (...args: any[]) => any;
  onCurrentChange?: (...args: any[]) => any;
  onSelectAll?: (...args: any[]) => any;
  onSelectionChange?: (...args: any[]) => any;
  onCellMouseEnter?: (...args: any[]) => any;
  onCellMouseLeave?: (...args: any[]) => any;
  onCellContextmenu?: (...args: any[]) => any;
  onCellClick?: (...args: any[]) => any;
  onCellDblclick?: (...args: any[]) => any;
  onRowClick?: (...args: any[]) => any;
  onRowContextmenu?: (...args: any[]) => any;
  onRowDblclick?: (...args: any[]) => any;
  onHeaderClick?: (...args: any[]) => any;
  onHeaderContextmenu?: (...args: any[]) => any;
  onSortChange?: (evt: { column?: any; prop?: string; order?: SortOrder }) => any;
  onFilterChange?: (...args: any[]) => any;
  onHeaderDragend?: (...args: any[]) => any;
}

export const Table: (props: TableProps) => any;

export interface TableColumnProps {
  type?: string;
  label?: string;
  className?: ClassValue;
  labelClassName?: ClassValue;
  prop?: string;
  width?: string | number;
  minWidth?: string | number;
  renderHeader?: (data: { column: any; $index: number }) => any;
  sortable?: boolean | string;
  sortMethod?: (a: any, b: any) => number;
  sortBy?: string | string[] | ((row: any, index: number) => string);
  resizable?: boolean;
  columnKey?: string;
  align?: string;
  headerAlign?: string;
  showTooltipWhenOverflow?: boolean;
  showOverflowTooltip?: boolean;
  fixed?: boolean | 'left' | 'right';
  formatter?: (row: any, column: any, cellValue: any, index: number) => any;
  selectable?: (row: any, index: number) => boolean;
  reserveSelection?: boolean;
  filterMethod?: (value: any, row: any, column: any) => boolean;
  filteredValue?: string[];
  filters?: FilterList;
  filterPlacement?: string;
  filterMultiple?: boolean;
  index?: number | ((index: number) => number);
  sortOrders?: ('ascending' | 'descending' | null)[];
}

export const TableColumn: (props: TableColumnProps) => any;

export interface DropdownProps {
  trigger?: 'focus' | 'hover' | 'click' | 'contextmenu';
  effect?: string;
  type?: ButtonProps['type'];
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  size?: string;
  splitButton?: boolean;
  hideOnClick?: boolean;
  showTimeout?: number;
  hideTimeout?: number;
  tabindex?: number;
  disabled?: boolean;

  onClick?: () => any;
  onVisibleChange?: (visible: any) => any;
  onCommand?: (command: any) => any;
}

export const Dropdown: (props: DropdownProps) => any;

export interface DropdownItemProps {
  command?: any;
  disabled?: boolean;
  divided?: boolean;
  icon?: any;
}

export const DropdownItem = (props: DropdownItemProps) => any;

export const DropdownMenu = (props: {}) => any;

export interface FormProps {
  model?: any;
  rules?: Record<string, any>;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string;
  labelSuffix?: string;
  inline?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  showMessage?: boolean;
  size?: string;
  disabled?: string;
  validateOnRuleChange?: string;
  hideRequiredAsterisk?: boolean;

  ref: { value?: { validate: () => Promise<boolean>; resetFields: () => void; clearValidate: () => void } };
}

export const Form = (props: FormProps) => any;

export interface FormItemProps {
  label?: string;
  labelWidth?: string | number;
  prop?: string;
  required?: boolean;
  rules?: any[];
  error?: string;
  inlineMessage?: boolean;
  showMessage?: boolean;
  size?: string;
}
export const FormItem = (props: FormItemProps) => any;
