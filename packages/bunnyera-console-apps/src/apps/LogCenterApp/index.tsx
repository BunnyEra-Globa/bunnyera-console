// ============================================
// LogCenterApp - 日志中心
// ============================================

import React, { useEffect, useState } from 'react';
import { mockApi } from '../../core';
import type { LogEntry, LogLevel } from '../../types';

// 日志级别配置
const levelConfig: Record<LogLevel, { label: string; bg: string; color: string; icon: string }> = {
  debug: { label: 'DEBUG', bg: '#f3f4f6', color: '#6b7280', icon: '🐛' },
  info: { label: 'INFO', bg: '#dbeafe', color: '#1d4ed8', icon: 'ℹ️' },
  warn: { label: 'WARN', bg: '#fef3c7', color: '#d97706', icon: '⚠️' },
  error: { label: 'ERROR', bg: '#fee2e2', color: '#dc2626', icon: '❌' },
  fatal: { label: 'FATAL', bg: '#fecaca', color: '#991b1b', icon: '💥' },
};

// 级别标签组件
interface LevelBadgeProps {
  level: LogLevel;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level }) => {
  const config = levelConfig[level];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      background: config.bg,
      color: config.color,
      fontFamily: 'monospace',
    }}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

// 日志行组件
interface LogRowProps {
  log: LogEntry;
  isExpanded: boolean;
  onToggle: () => void;
}

const LogRow: React.FC<LogRowProps> = ({ log, isExpanded, onToggle }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div
      onClick={onToggle}
      style={{
        borderBottom: '1px solid #f3f4f6',
        cursor: 'pointer',
        transition: 'background 0.2s',
        background: isExpanded ? '#f9fafb' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isExpanded) e.currentTarget.style.background = '#fafafa';
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* 主要信息行 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '100px 100px 140px 1fr',
        gap: '16px',
        padding: '12px 16px',
        alignItems: 'center',
      }}>
        <LevelBadge level={log.level} />
        <span style={{
          fontSize: '12px',
          color: '#6b7280',
          fontFamily: 'monospace',
        }}>
          {formatTime(log.timestamp)}
        </span>
        <span style={{
          fontSize: '12px',
          color: '#374151',
          fontFamily: 'monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {log.source}
        </span>
        <span style={{
          fontSize: '13px',
          color: '#111827',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {log.message}
        </span>
      </div>

      {/* 展开详情 */}
      {isExpanded && (
        <div style={{
          padding: '16px',
          background: '#f9fafb',
          borderTop: '1px dashed #e5e7eb',
        }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>完整消息</div>
            <div style={{
              fontSize: '13px',
              color: '#374151',
              lineHeight: '1.6',
              padding: '12px',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}>
              {log.message}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>来源</div>
            <div style={{
              fontSize: '13px',
              color: '#374151',
              fontFamily: 'monospace',
            }}>
              {log.source}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>时间戳</div>
            <div style={{
              fontSize: '13px',
              color: '#374151',
              fontFamily: 'monospace',
            }}>
              {new Date(log.timestamp).toISOString()}
            </div>
          </div>

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>元数据</div>
              <pre style={{
                fontSize: '12px',
                color: '#374151',
                background: '#fff',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                overflow: 'auto',
                margin: 0,
              }}>
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 统计卡片
interface StatCardProps {
  title: string;
  count: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, color }) => (
  <div style={{
    background: '#fff',
    borderRadius: '10px',
    padding: '16px 20px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }}>
    <div style={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: color,
    }} />
    <div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>{title}</div>
      <div style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>{count}</div>
    </div>
  </div>
);

// ============================================
// LogCenterApp 主组件
// ============================================

export interface LogCenterAppProps {
  className?: string;
}

export const LogCenterApp: React.FC<LogCenterAppProps> = ({ className }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [recentErrors, setRecentErrors] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);

  const levelOptions: { value: LogLevel | 'all'; label: string }[] = [
    { value: 'all', label: '全部级别' },
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warn' },
    { value: 'error', label: 'Error' },
    { value: 'fatal', label: 'Fatal' },
  ];

  useEffect(() => {
    loadLogs();
  }, [levelFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const [logsData, errorsData] = await Promise.all([
        mockApi.logs.getList({ level: levelFilter === 'all' ? undefined : levelFilter }),
        mockApi.logs.getRecentErrors(5),
      ]);
      setLogs(logsData);
      setRecentErrors(errorsData);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  // 统计数据
  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error' || l.level === 'fatal').length,
    warns: logs.filter(l => l.level === 'warn').length,
    infos: logs.filter(l => l.level === 'info').length,
  };

  // 显示的日志
  const displayLogs = showErrorsOnly
    ? logs.filter(l => l.level === 'error' || l.level === 'fatal')
    : logs;

  return (
    <div className={className} style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
          日志中心
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>查看和分析系统日志</p>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <StatCard title="总日志数" count={stats.total} color="#6b7280" />
        <StatCard title="错误" count={stats.errors} color="#dc2626" />
        <StatCard title="警告" count={stats.warns} color="#d97706" />
        <StatCard title="信息" count={stats.infos} color="#1d4ed8" />
      </div>

      {/* 筛选栏 */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as LogLevel | 'all')}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          {levelOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151',
        }}>
          <input
            type="checkbox"
            checked={showErrorsOnly}
            onChange={(e) => setShowErrorsOnly(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          仅显示错误
        </label>

        <div style={{ flex: 1 }} />

        <button
          onClick={loadLogs}
          style={{
            padding: '10px 20px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          🔄 刷新
        </button>
      </div>

      {/* 最近错误提示 */}
      {recentErrors.length > 0 && !showErrorsOnly && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#dc2626',
          }}>
            <span>⚠️</span>
            最近错误 ({recentErrors.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentErrors.slice(0, 3).map(error => (
              <div key={error.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13px',
                color: '#7f1d1d',
              }}>
                <span style={{ fontFamily: 'monospace', color: '#991b1b' }}>
                  {new Date(error.timestamp).toLocaleTimeString('zh-CN')}
                </span>
                <span style={{ fontWeight: '500' }}>{error.source}</span>
                <span>{error.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 日志列表 */}
      <div style={{
        flex: 1,
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 表头 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '100px 100px 140px 1fr',
          gap: '16px',
          padding: '12px 16px',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
          textTransform: 'uppercase',
        }}>
          <span>级别</span>
          <span>时间</span>
          <span>来源</span>
          <span>消息</span>
        </div>

        {/* 日志内容 */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
              <div>加载中...</div>
            </div>
          ) : displayLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <div>暂无日志</div>
            </div>
          ) : (
            displayLogs.map(log => (
              <LogRow
                key={log.id}
                log={log}
                isExpanded={expandedLogId === log.id}
                onToggle={() => handleToggleExpand(log.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* 底部信息 */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        color: '#6b7280',
      }}>
        <span>显示 {displayLogs.length} 条日志</span>
        <span>自动刷新: 已开启</span>
      </div>
    </div>
  );
};

export default LogCenterApp;
