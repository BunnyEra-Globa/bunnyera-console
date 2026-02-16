import { ReactNode } from 'react';

// ========================================
// 基础类型
// ========================================

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type Status = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type Placement = 'top' | 'right' | 'bottom' | 'left';

// ========================================
// 用户类型
// ========================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLoginAt?: string;
}

// ========================================
// 项目类型
// ========================================

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'draft';
  owner: User;
  members: User[];
  coverImage?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  progress: number;
}

// ========================================
// 资源类型
// ========================================

export interface Resource {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'link' | 'document';
  size?: number;
  mimeType?: string;
  url?: string;
  parentId?: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  thumbnail?: string;
}

// ========================================
// AI Hub 类型
// ========================================

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  status: 'available' | 'unavailable' | 'maintenance';
  pricing?: {
    input: number;
    output: number;
    unit: string;
  };
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  model: AIModel;
  systemPrompt?: string;
  tools: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AIConversation {
  id: string;
  title: string;
  agentId: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ========================================
// 日志类型
// ========================================

export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  traceId?: string;
}

// ========================================
// 笔记类型
// ========================================

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
}

// ========================================
// 导航类型
// ========================================

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  children?: NavItem[];
  badge?: number | string;
  disabled?: boolean;
  external?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

// ========================================
// 布局类型
// ========================================

export interface LayoutProps {
  children?: ReactNode;
  className?: string;
}

export interface SidebarProps {
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  className?: string;
}

export interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export interface WorkspaceProps {
  children?: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// ========================================
// 组件 Props 类型
// ========================================

export interface ButtonProps {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export interface CardProps {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  cover?: ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  autoFocus?: boolean;
  maxLength?: number;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  autoResize?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export interface TagProps {
  children?: ReactNode;
  color?: Status | string;
  closable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface BadgeProps {
  count?: number;
  max?: number;
  dot?: boolean;
  status?: Status;
  text?: string;
  children?: ReactNode;
  offset?: [number, number];
  className?: string;
}

export interface TableColumn<T = unknown> {
  key: string;
  title: ReactNode;
  dataIndex?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean | ((a: T, b: T) => number);
  render?: (value: unknown, record: T, index: number) => ReactNode;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
}

export interface TableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange?: (page: number, pageSize: number) => void;
  };
  selectable?: boolean;
  selectedRowKeys?: string[];
  onSelectChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  onRowClick?: (record: T, index: number) => void;
  emptyText?: ReactNode;
  className?: string;
  striped?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  centered?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  confirmLoading?: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

export interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  placement?: Placement;
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  className?: string;
}

export interface TabItem {
  key: string;
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  type?: 'line' | 'card' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  className?: string;
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ListProps<T = unknown> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  loading?: boolean;
  emptyText?: ReactNode;
  className?: string;
  itemClassName?: string;
  bordered?: boolean;
  split?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  shortcut?: string;
  className?: string;
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export interface DropdownProps {
  trigger?: ReactNode;
  items: {
    key: string;
    label: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    danger?: boolean;
    onClick?: () => void;
    divider?: boolean;
  }[];
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  className?: string;
}

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: Placement;
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  className?: string;
}

export interface SkeletonProps {
  loading?: boolean;
  children?: ReactNode;
  rows?: number;
  avatar?: boolean;
  title?: boolean;
  paragraph?: boolean;
  className?: string;
}

export interface ProgressProps {
  percent: number;
  size?: 'sm' | 'md' | 'lg';
  type?: 'line' | 'circle';
  status?: 'success' | 'error' | 'active' | 'normal';
  showInfo?: boolean;
  strokeColor?: string;
  trailColor?: string;
  className?: string;
}

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
  className?: string;
}

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  value?: string;
  children?: ReactNode;
  className?: string;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: { label: ReactNode; value: string; disabled?: boolean }[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  format?: string;
  showTime?: boolean;
  className?: string;
}

export interface TimePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  format?: string;
  className?: string;
}

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

export interface AlertProps {
  type?: Status;
  message: ReactNode;
  description?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  showIcon?: boolean;
  banner?: boolean;
  className?: string;
}

export interface NotificationProps {
  type?: Status;
  message: ReactNode;
  description?: ReactNode;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export interface PopoverProps {
  content: ReactNode;
  title?: ReactNode;
  children: ReactNode;
  placement?: Placement;
  trigger?: 'hover' | 'click' | 'focus';
  className?: string;
}

export interface CollapseProps {
  items: {
    key: string;
    label: ReactNode;
    children: ReactNode;
    disabled?: boolean;
  }[];
  activeKey?: string | string[];
  defaultActiveKey?: string | string[];
  onChange?: (key: string | string[]) => void;
  accordion?: boolean;
  bordered?: boolean;
  className?: string;
}

export interface TimelineProps {
  items: {
    color?: Status | string;
    dot?: ReactNode;
    children: ReactNode;
    label?: ReactNode;
  }[];
  mode?: 'left' | 'right' | 'alternate';
  className?: string;
}

export interface StepsProps {
  current: number;
  items: {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
  }[];
  direction?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface TransferProps<T = unknown> {
  dataSource: T[];
  targetKeys: string[];
  onChange: (targetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => void;
  render: (item: T) => ReactNode;
  titles?: [ReactNode, ReactNode];
  className?: string;
}

export interface TreeProps<T = unknown> {
  data: TreeNode<T>[];
  selectable?: boolean;
  selectedKeys?: string[];
  onSelect?: (selectedKeys: string[], info: { selected: boolean; node: TreeNode<T> }) => void;
  checkable?: boolean;
  checkedKeys?: string[];
  onCheck?: (checkedKeys: string[], info: { checked: boolean; node: TreeNode<T> }) => void;
  defaultExpandAll?: boolean;
  expandedKeys?: string[];
  onExpand?: (expandedKeys: string[], info: { expanded: boolean; node: TreeNode<T> }) => void;
  className?: string;
}

export interface TreeNode<T = unknown> {
  key: string;
  title: ReactNode;
  children?: TreeNode<T>[];
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  isLeaf?: boolean;
  data?: T;
}

export interface UploadProps {
  accept?: string;
  multiple?: boolean;
  directory?: boolean;
  maxCount?: number;
  maxSize?: number;
  disabled?: boolean;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onChange?: (info: { file: File; fileList: File[] }) => void;
  onRemove?: (file: File) => void;
  customRequest?: (options: { file: File; onSuccess: () => void; onError: (error: Error) => void; onProgress: (percent: number) => void }) => void;
  children?: ReactNode;
  className?: string;
}

export interface FormProps {
  children?: ReactNode;
  onSubmit?: (values: Record<string, unknown>) => void;
  onReset?: () => void;
  initialValues?: Record<string, unknown>;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelAlign?: 'left' | 'right';
  labelCol?: { span?: number; offset?: number };
  wrapperCol?: { span?: number; offset?: number };
  className?: string;
}

export interface FormItemProps {
  name?: string;
  label?: ReactNode;
  rules?: {
    required?: boolean;
    message?: string;
    type?: string;
    min?: number;
    max?: number;
    pattern?: RegExp;
    validator?: (rule: unknown, value: unknown) => Promise<void>;
  }[];
  children?: ReactNode;
  className?: string;
}

export interface MenuProps {
  items: MenuItem[];
  mode?: 'vertical' | 'horizontal' | 'inline';
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onSelect?: (info: { key: string; item: MenuItem }) => void;
  onOpenChange?: (openKeys: string[]) => void;
  inlineCollapsed?: boolean;
  className?: string;
}

export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: MenuItem[];
  disabled?: boolean;
  danger?: boolean;
  type?: 'item' | 'group' | 'divider';
  onClick?: () => void;
}

export interface SpinProps {
  spinning?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tip?: ReactNode;
  delay?: number;
  indicator?: ReactNode;
  fullscreen?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface StatisticProps {
  title?: ReactNode;
  value: number | string;
  precision?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  formatter?: (value: number | string) => ReactNode;
  valueStyle?: React.CSSProperties;
  className?: string;
}

export interface DescriptionsProps {
  title?: ReactNode;
  bordered?: boolean;
  column?: number;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
  items: {
    label: ReactNode;
    children: ReactNode;
    span?: number;
  }[];
  className?: string;
}

export interface ResultProps {
  status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export interface ImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  preview?: boolean;
  fallback?: string;
  placeholder?: ReactNode;
  onClick?: () => void;
  onError?: () => void;
  className?: string;
}

export interface QRCodeProps {
  value: string;
  size?: number;
  color?: string;
  bgColor?: string;
  bordered?: boolean;
  errorLevel?: 'L' | 'M' | 'Q' | 'H';
  icon?: string;
  iconSize?: number;
  status?: 'active' | 'expired' | 'loading';
  onRefresh?: () => void;
  className?: string;
}

export interface WatermarkProps {
  content?: string;
  image?: string;
  width?: number;
  height?: number;
  rotate?: number;
  zIndex?: number;
  gap?: [number, number];
  offset?: [number, number];
  font?: {
    color?: string;
    fontSize?: number;
    fontWeight?: number | string;
    fontFamily?: string;
    fontStyle?: string;
  };
  children?: ReactNode;
  className?: string;
}

export interface TourProps {
  open?: boolean;
  onClose?: () => void;
  onFinish?: () => void;
  steps: {
    target: () => HTMLElement | null;
    title?: ReactNode;
    description?: ReactNode;
    cover?: ReactNode;
    placement?: Placement;
    mask?: boolean;
  }[];
  current?: number;
  onChange?: (current: number) => void;
  className?: string;
}

export interface FloatButtonProps {
  icon?: ReactNode;
  description?: ReactNode;
  type?: 'default' | 'primary';
  shape?: 'circle' | 'square';
  onClick?: () => void;
  tooltip?: ReactNode;
  badge?: BadgeProps;
  className?: string;
}

export interface AffixProps {
  offsetTop?: number;
  offsetBottom?: number;
  target?: () => HTMLElement | Window | null;
  onChange?: (affixed: boolean) => void;
  children: ReactNode;
  className?: string;
}

export interface AnchorProps {
  items: {
    key: string;
    href: string;
    title: ReactNode;
    children?: {
      key: string;
      href: string;
      title: ReactNode;
    }[];
  }[];
  bounds?: number;
  offsetTop?: number;
  affix?: boolean;
  showInkInFixed?: boolean;
  getContainer?: () => HTMLElement | Window;
  onClick?: (e: React.MouseEvent, link: { title: ReactNode; href: string }) => void;
  onChange?: (currentActiveLink: string) => void;
  className?: string;
}

export interface BackTopProps {
  visibilityHeight?: number;
  target?: () => HTMLElement | Window | null;
  onClick?: () => void;
  duration?: number;
  children?: ReactNode;
  className?: string;
}

export interface ConfigProviderProps {
  prefixCls?: string;
  theme?: 'light' | 'dark';
  primaryColor?: string;
  locale?: string;
  children: ReactNode;
}
