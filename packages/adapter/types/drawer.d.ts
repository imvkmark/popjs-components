export enum DrawerDirection {
  LTR = 'ltr', // left to right
  RTL = 'rtl', // right to left
  TTB = 'ttb', // top to bottom
  BTT = 'btt', // bottom to top
}

/** Drawer Component */
export interface DrawerProps {
  modelValue?: boolean;

  /* Equivalent to `Dialog`'s append to body attribute, when applying nested drawer, make sure this one is set to true */
  appendToBody?: boolean;

  /* Hook method called before close drawer, the first parameter is a function which should determine if the drawer should be closed */
  beforeClose?: (done: () => void) => void;

  /** Whether the Drawer can be closed by pressing ESC */
  closeOnPressEscape?: boolean;

  /** Custom class names for Dialog */
  customClass?: string;

  /* Determine whether the wrapped children should be destroyed, if true, children's destroyed life cycle method will be called all local state will be destroyed */
  destroyOnClose?: boolean;

  /* Equivalent to `Dialog`'s modal attribute, determines whether the dark shadowing background should show */
  modal?: boolean;

  /* Equivalent to `Dialog`'s modal-append-to-body attribute, determines whether the shadowing background should be inserted direct to DocumentBody element */
  modalAppendToBody?: boolean;

  /* Attributes that controls the drawer's direction of display */
  direction?: Direction;

  /* Whether the close button should be rendered to control the drawer's visible state */
  showClose?: boolean;

  /* The size of the drawer component, supporting number with unit of pixel, string by percentage e.g. 30% */
  size?: number | string;

  /* The Drawer's title, also can be replaced by named slot `title` */
  title?: string;

  withHeader?: boolean;

  // vue 2 点击遮罩关闭
  wrapperClosable?: boolean;
  // vue 3 点击遮罩关闭
  closeOnClickModal?: boolean;

  // events
  'onUpdate:modelValue'?: (visible: boolean) => void;

  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
}

export const Drawer: (props: DrawerProps) => any;
