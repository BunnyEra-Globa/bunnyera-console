// ========================================
// BunnyEra Console UI
// A React UI Framework for Modern Admin Console
// ========================================

// ========================================
// Layout Components
// ========================================

export {
  // 主布局
  Layout,
  AppLayout,
  SplitLayout,
  ThreeColumnLayout,
  StackedLayout,
  
  // 侧边栏
  Sidebar,
  SidebarSection,
  SidebarItem,
  type SidebarProps,
  type SidebarSectionProps,
  type SidebarItemProps,
  
  // 顶部栏
  Header,
  HeaderBreadcrumb,
  SearchBar,
  type HeaderProps,
  type HeaderBreadcrumbProps,
  type SearchBarProps,
  
  // 工作区
  Workspace,
  PageContainer,
  PageHeader,
  PageContent,
  PageSection,
  Grid,
  Flex,
  Container,
  type WorkspaceProps,
  type PageContainerProps,
  type PageHeaderProps,
  type PageContentProps,
  type PageSectionProps,
  type GridProps,
  type FlexProps,
  type ContainerProps,
  
  // 布局 Props
  type LayoutProps,
  type AppLayoutProps,
  type SplitLayoutProps,
  type ThreeColumnLayoutProps,
  type StackedLayoutProps,
} from './layout/Layout';

// ========================================
// UI Components
// ========================================

// Button
export {
  Button,
  ButtonGroup,
  IconButton,
  ActionButton,
  type ButtonProps,
  type ButtonGroupProps,
  type IconButtonProps,
  type ActionButtonProps,
} from './components/Button';

// Card
export {
  Card,
  CardGrid,
  StatCard,
  InfoCard,
  MediaCard,
  type CardProps,
  type CardGridProps,
  type StatCardProps,
  type InfoCardProps,
  type MediaCardProps,
} from './components/Card';

// Input
export {
  Input,
  SearchInput,
  InputGroup,
  InputAddon,
  NumberInput,
  type InputProps,
  type SearchInputProps,
  type InputGroupProps,
  type InputAddonProps,
  type NumberInputProps,
} from './components/Input';

// Select
export {
  Select,
  OptionGroup,
  type SelectProps,
  type SelectOption,
  type OptionGroupProps,
} from './components/Select';

// Textarea
export {
  Textarea,
  AutoResizeTextarea,
  RichTextarea,
  MentionTextarea,
  type TextareaProps,
  type AutoResizeTextareaProps,
  type RichTextareaProps,
  type MentionTextareaProps,
  type MentionOption,
} from './components/Textarea';

// Tag
export {
  Tag,
  TagGroup,
  CheckableTag,
  EditableTagGroup,
  StatusTag,
  type TagProps,
  type TagGroupProps,
  type CheckableTagProps,
  type EditableTagGroupProps,
  type StatusTagProps,
} from './components/Tag';

// Badge
export {
  Badge,
  StatusBadge,
  NotificationBadge,
  DotBadge,
  Ribbon,
  StepBadge,
  TrendBadge,
  type BadgeProps,
  type StatusBadgeProps,
  type NotificationBadgeProps,
  type DotBadgeProps,
  type RibbonProps,
  type StepBadgeProps,
  type TrendBadgeProps,
} from './components/Badge';

// Table
export {
  Table,
  List,
  type TableProps,
  type TableColumn,
  type ListProps,
} from './components/Table';

// Modal
export {
  Modal,
  ConfirmModal,
  useModal,
  type ModalProps,
  type ConfirmModalProps,
  type UseModalReturn,
} from './components/Modal';

// Drawer
export {
  Drawer,
  DrawerForm,
  useDrawer,
  type DrawerProps,
  type DrawerPlacement,
  type DrawerFormProps,
  type UseDrawerReturn,
} from './components/Drawer';

// Tabs
export {
  Tabs,
  TabPane,
  DraggableTabs,
  CompactTabs,
  VerticalTabs,
  useTabs,
  type TabsProps,
  type TabItem,
  type TabPaneProps,
  type DraggableTabsProps,
  type CompactTabsProps,
  type VerticalTabsProps,
  type UseTabsReturn,
} from './components/Tabs';

// EmptyState
export {
  EmptyState,
  EmptySearch,
  EmptyFolder,
  EmptyData,
  EmptyError,
  EmptyLoading,
  EmptyResult,
  type EmptyStateProps,
  type EmptySearchProps,
  type EmptyFolderProps,
  type EmptyDataProps,
  type EmptyErrorProps,
  type EmptyLoadingProps,
  type EmptyResultProps,
} from './components/EmptyState';

// Checkbox
export {
  Checkbox,
  CheckboxGroup,
  type CheckboxProps,
  type CheckboxGroupProps,
} from './components/Checkbox';

// Avatar
export {
  Avatar,
  AvatarGroup,
  type AvatarProps,
  type AvatarGroupProps,
} from './components/Avatar';

// ========================================
// Context
// ========================================

export {
  NavigationProvider,
  useNavigation,
  withNavigation,
  PAGE_CONFIG,
  getPageLabel,
  getPageIcon,
  getPagePath,
  type NavigationProviderProps,
  type NavigationContextValue,
  type NavigationState,
  type NavPage,
  type WithNavigationProps,
} from './context/NavigationContext';

// ========================================
// Hooks
// ========================================

export {
  // 数据 Hooks
  useProjects,
  useProject,
  useResources,
  useResource,
  useAIHub,
  useConversation,
  useLogs,
  useRealtimeLogs,
  useCurrentUser,
  useAuth,
  usePermissions,
  
  // 工具 Hooks
  useLocalStorage,
  useDebounce,
  useThrottle,
  useClickOutside,
  useWindowSize,
  useMediaQuery,
  useKeyPress,
  useAsync,
  usePrevious,
  useCounter,
  useBoolean,
  useArray,
  useMounted,
  useDarkMode,
  
  // 类型
  type UseProjectsReturn,
  type UseProjectReturn,
  type UseResourcesReturn,
  type UseResourceReturn,
  type UseAIHubReturn,
  type UseConversationReturn,
  type UseLogsReturn,
  type UseRealtimeLogsReturn,
  type UseCurrentUserReturn,
  type UserPreferences,
  type UseAuthReturn,
  type UsePermissionsReturn,
  type Permission,
} from './hooks';

// ========================================
// Theme & Utils
// ========================================

export {
  // 工具函数
  cn,
  formatFileSize,
  formatDate,
  formatRelativeTime,
  truncate,
  generateId,
  deepClone,
  debounce,
  throttle,
  getStatusColor,
  getStatusBgColor,
  isDarkMode,
  setTheme,
  watchTheme,
  scrollToElement,
  copyToClipboard,
  downloadFile,
  parseQueryString,
  buildQueryString,
  getInitials,
  generateColor,
  isEmpty,
  isObject,
  get,
  groupBy,
  uniqueBy,
  sortBy,
} from './theme/utils';

// ========================================
// Types
// ========================================

export type {
  // 基础类型
  Size,
  Variant,
  Status,
  Placement,
  
  // 业务类型
  User,
  Project,
  Resource,
  AIModel,
  AIAgent,
  AIConversation,
  AIMessage,
  LogEntry,
  Note,
  NavItem,
  NavSection,
  
  // 组件 Props 类型
  LayoutProps,
  SidebarProps,
  HeaderProps,
  WorkspaceProps,
  ButtonProps,
  CardProps,
  InputProps,
  SelectOption,
  SelectProps,
  TextareaProps,
  TagProps,
  BadgeProps,
  TableColumn,
  TableProps,
  ModalProps,
  DrawerProps,
  TabItem,
  TabsProps,
  EmptyStateProps,
  ListProps,
  SearchBarProps,
  AvatarProps,
  DropdownProps,
  TooltipProps,
  SkeletonProps,
  ProgressProps,
  SwitchProps,
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
  DatePickerProps,
  TimePickerProps,
  BreadcrumbItem,
  BreadcrumbProps,
  PaginationProps,
  AlertProps,
  NotificationProps,
  PopoverProps,
  CollapseProps,
  TimelineProps,
  StepsProps,
  TransferProps,
  TreeProps,
  TreeNode,
  UploadProps,
  FormProps,
  FormItemProps,
  MenuProps,
  MenuItem,
  SpinProps,
  StatisticProps,
  DescriptionsProps,
  ResultProps,
  ImageProps,
  QRCodeProps,
  WatermarkProps,
  TourProps,
  FloatButtonProps,
  AffixProps,
  AnchorProps,
  BackTopProps,
  ConfigProviderProps,
} from './types';

// ========================================
// CSS
// ========================================

// 导入 CSS 文件
import './theme/index.css';

// ========================================
// Version
// ========================================

export const version = '1.0.0';
