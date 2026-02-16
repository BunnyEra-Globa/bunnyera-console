import { useState, useEffect, useCallback } from 'react';
import type { LogEntry } from '../types';

// ========================================
// Mock 数据
// ========================================

const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    level: 'info',
    message: '用户登录成功',
    source: 'auth.service',
    metadata: { userId: '1', ip: '192.168.1.1' },
    timestamp: '2024-06-20T10:30:00Z',
    userId: '1',
    traceId: 'trace-001',
  },
  {
    id: '2',
    level: 'debug',
    message: '数据库查询完成',
    source: 'db.query',
    metadata: { duration: '45ms', rows: 10 },
    timestamp: '2024-06-20T10:29:55Z',
    traceId: 'trace-001',
  },
  {
    id: '3',
    level: 'warn',
    message: 'API 响应时间超过阈值',
    source: 'api.gateway',
    metadata: { endpoint: '/api/users', duration: '1200ms', threshold: '1000ms' },
    timestamp: '2024-06-20T10:29:50Z',
    traceId: 'trace-002',
  },
  {
    id: '4',
    level: 'error',
    message: '数据库连接失败',
    source: 'db.connection',
    metadata: { error: 'ECONNREFUSED', host: 'localhost', port: 5432 },
    timestamp: '2024-06-20T10:29:45Z',
    traceId: 'trace-003',
  },
  {
    id: '5',
    level: 'fatal',
    message: '系统内存不足',
    source: 'system.monitor',
    metadata: { memory: '95%', threshold: '90%' },
    timestamp: '2024-06-20T10:29:40Z',
    traceId: 'trace-004',
  },
  {
    id: '6',
    level: 'info',
    message: '项目创建成功',
    source: 'project.service',
    metadata: { projectId: '123', name: 'New Project' },
    timestamp: '2024-06-20T10:29:35Z',
    userId: '2',
    traceId: 'trace-005',
  },
  {
    id: '7',
    level: 'debug',
    message: '缓存命中',
    source: 'cache.manager',
    metadata: { key: 'user:1', ttl: 300 },
    timestamp: '2024-06-20T10:29:30Z',
    traceId: 'trace-006',
  },
  {
    id: '8',
    level: 'warn',
    message: '未授权访问尝试',
    source: 'auth.middleware',
    metadata: { path: '/api/admin', ip: '10.0.0.1' },
    timestamp: '2024-06-20T10:29:25Z',
    traceId: 'trace-007',
  },
  {
    id: '9',
    level: 'info',
    message: '定时任务执行完成',
    source: 'scheduler',
    metadata: { job: 'cleanup', duration: '2s' },
    timestamp: '2024-06-20T10:29:20Z',
    traceId: 'trace-008',
  },
  {
    id: '10',
    level: 'error',
    message: '文件上传失败',
    source: 'file.service',
    metadata: { filename: 'large-file.zip', size: '500MB', error: 'File too large' },
    timestamp: '2024-06-20T10:29:15Z',
    userId: '3',
    traceId: 'trace-009',
  },
];

// ========================================
// Hook 返回类型
// ========================================

export interface UseLogsReturn {
  /** 日志列表 */
  logs: LogEntry[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => void;
  /** 按级别筛选 */
  filterByLevel: (level: LogEntry['level'] | LogEntry['level'][]) => LogEntry[];
  /** 按来源筛选 */
  filterBySource: (source: string) => LogEntry[];
  /** 按时间范围筛选 */
  filterByTimeRange: (start: Date, end: Date) => LogEntry[];
  /** 搜索日志 */
  searchLogs: (query: string) => LogEntry[];
  /** 获取日志级别统计 */
  levelStats: Record<LogEntry['level'], number>;
  /** 获取来源列表 */
  sources: string[];
  /** 导出日志 */
  exportLogs: (format: 'json' | 'csv') => string;
  /** 清空日志 */
  clearLogs: () => Promise<void>;
}

// ========================================
// useLogs Hook
// ========================================

export function useLogs(): UseLogsReturn {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 模拟获取数据
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // 按时间倒序排列
      setLogs([...MOCK_LOGS].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch logs'));
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // 按级别筛选
  const filterByLevel = useCallback((level: LogEntry['level'] | LogEntry['level'][]): LogEntry[] => {
    const levels = Array.isArray(level) ? level : [level];
    return logs.filter((log) => levels.includes(log.level));
  }, [logs]);

  // 按来源筛选
  const filterBySource = useCallback((source: string): LogEntry[] => {
    return logs.filter((log) => log.source === source);
  }, [logs]);

  // 按时间范围筛选
  const filterByTimeRange = useCallback((start: Date, end: Date): LogEntry[] => {
    return logs.filter((log) => {
      const logTime = new Date(log.timestamp);
      return logTime >= start && logTime <= end;
    });
  }, [logs]);

  // 搜索日志
  const searchLogs = useCallback((query: string): LogEntry[] => {
    const lowerQuery = query.toLowerCase();
    return logs.filter(
      (log) =>
        log.message.toLowerCase().includes(lowerQuery) ||
        log.source.toLowerCase().includes(lowerQuery) ||
        log.traceId?.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(log.metadata).toLowerCase().includes(lowerQuery)
    );
  }, [logs]);

  // 日志级别统计
  const levelStats = useMemo(() => {
    const stats: Record<LogEntry['level'], number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      fatal: 0,
    };
    logs.forEach((log) => {
      stats[log.level]++;
    });
    return stats;
  }, [logs]);

  // 来源列表
  const sources = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.source))).sort();
  }, [logs]);

  // 导出日志
  const exportLogs = useCallback((format: 'json' | 'csv'): string => {
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }
    
    // CSV 格式
    const headers = ['timestamp', 'level', 'source', 'message', 'userId', 'traceId'];
    const rows = logs.map((log) => [
      log.timestamp,
      log.level,
      log.source,
      log.message,
      log.userId || '',
      log.traceId || '',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }, [logs]);

  // 清空日志
  const clearLogs = useCallback(async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLogs([]);
  }, []);

  return {
    logs,
    loading,
    error,
    refresh: fetchLogs,
    filterByLevel,
    filterBySource,
    filterByTimeRange,
    searchLogs,
    levelStats,
    sources,
    exportLogs,
    clearLogs,
  };
}

// ========================================
// 辅助函数
// ========================================

function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const [value, setValue] = useState<T>(factory);
  
  useEffect(() => {
    setValue(factory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  return value;
}

// ========================================
// useRealtimeLogs Hook (实时日志)
// ========================================

export interface UseRealtimeLogsReturn extends UseLogsReturn {
  /** 是否实时更新 */
  isRealtime: boolean;
  /** 切换实时更新 */
  toggleRealtime: () => void;
  /** 暂停实时更新 */
  pause: () => void;
  /** 恢复实时更新 */
  resume: () => void;
}

export function useRealtimeLogs(): UseRealtimeLogsReturn {
  const logsData = useLogs();
  const [isRealtime, setIsRealtime] = useState(false);

  // 模拟实时日志推送
  useEffect(() => {
    if (!isRealtime) return;

    const interval = setInterval(() => {
      const levels: LogEntry['level'][] = ['debug', 'info', 'warn', 'error'];
      const sources = ['api.gateway', 'db.query', 'auth.service', 'cache.manager'];
      const messages = [
        '请求处理完成',
        '数据库查询',
        '缓存更新',
        '用户认证',
        '定时任务执行',
      ];

      const newLog: LogEntry = {
        id: String(Date.now()),
        level: levels[Math.floor(Math.random() * levels.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        timestamp: new Date().toISOString(),
        metadata: { random: Math.random() },
      };

      logsData.logs.unshift(newLog);
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealtime, logsData.logs]);

  const toggleRealtime = useCallback(() => {
    setIsRealtime((prev) => !prev);
  }, []);

  const pause = useCallback(() => {
    setIsRealtime(false);
  }, []);

  const resume = useCallback(() => {
    setIsRealtime(true);
  }, []);

  return {
    ...logsData,
    isRealtime,
    toggleRealtime,
    pause,
    resume,
  };
}
