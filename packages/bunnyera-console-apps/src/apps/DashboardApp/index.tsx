// ============================================
// DashboardApp - 控制台总览
// ============================================

import React, { useEffect, useState } from 'react';
import { mockApi } from '../../core';
import type { DashboardStats, RecentActivity, ResourceStat } from '../../types';

// 统计卡片组件
interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => (
  <div style={{
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #e5e7eb',
  }}>
    <div style={{
      width: '56px',
      height: '56px',
      borderRadius: '12px',
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{value.toLocaleString()}</div>
      {trend && (
        <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>{trend}</div>
      )}
    </div>
  </div>
);

// 活动项组件
interface ActivityItemProps {
  activity: RecentActivity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const typeIcons: Record<string, string> = {
    project: '📁',
    resource: '📦',
    error: '⚠️',
    system: '⚙️',
  };

  const typeColors: Record<string, string> = {
    project: '#3b82f6',
    resource: '#10b981',
    error: '#ef4444',
    system: '#6b7280',
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '16px',
      borderRadius: '8px',
      transition: 'background 0.2s',
      cursor: 'pointer',
    }} onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f9fafb';
    }} onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${typeColors[activity.type]}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
      }}>
        {typeIcons[activity.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{activity.title}</div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>{activity.description}</div>
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{formatTime(activity.timestamp)}</div>
      </div>
    </div>
  );
};

// 资源图表组件
interface ResourceChartProps {
  stats: ResourceStat[];
}

const ResourceChart: React.FC<ResourceChartProps> = ({ stats }) => {
  const total = stats.reduce((sum, s) => sum + s.count, 0);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div>
      {/* 简单的条形图 */}
      <div style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => {
          const percentage = total > 0 ? (stat.count / total) * 100 : 0;
          return (
            <div key={stat.type} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                  {stat.type === 'file' && '文件'}
                  {stat.type === 'image' && '图片'}
                  {stat.type === 'video' && '视频'}
                  {stat.type === 'domain' && '域名'}
                  {stat.type === 'server' && '服务器'}
                </span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {stat.count} ({formatSize(stat.size)})
                </span>
              </div>
              <div style={{
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${percentage}%`,
                  background: colors[index % colors.length],
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 图例 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {stats.map((stat, index) => (
          <div key={stat.type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: colors[index % colors.length],
            }} />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {stat.type === 'file' && '文件'}
              {stat.type === 'image' && '图片'}
              {stat.type === 'video' && '视频'}
              {stat.type === 'domain' && '域名'}
              {stat.type === 'server' && '服务器'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// DashboardApp 主组件
// ============================================

export interface DashboardAppProps {
  className?: string;
}

export const DashboardApp: React.FC<DashboardAppProps> = ({ className }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [resourceStats, setResourceStats] = useState<ResourceStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, activitiesData, resourceStatsData] = await Promise.all([
          mockApi.dashboard.getStats(),
          mockApi.dashboard.getRecentActivities(6),
          mockApi.dashboard.getResourceStats(),
        ]);
        setStats(statsData);
        setActivities(activitiesData);
        setResourceStats(resourceStatsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#6b7280',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
          控制台总览
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>欢迎回来，这是您的工作台概览</p>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
      }}>
        <StatCard
          title="项目数量"
          value={stats?.projectCount || 0}
          icon="📁"
          color="#dbeafe"
          trend="+3 本月新增"
        />
        <StatCard
          title="错误数量"
          value={stats?.errorCount || 0}
          icon="⚠️"
          color="#fee2e2"
          trend="-2 较昨日"
        />
        <StatCard
          title="资源统计"
          value={stats?.resourceCount || 0}
          icon="📦"
          color="#dcfce7"
          trend="+12 本周新增"
        />
        <StatCard
          title="活动记录"
          value={stats?.activityCount || 0}
          icon="📊"
          color="#fef3c7"
          trend="持续更新"
        />
      </div>

      {/* 主要内容区域 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
      }}>
        {/* 最近活动 */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              最近活动
            </h2>
            <button style={{
              fontSize: '14px',
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}>
              查看全部
            </button>
          </div>
          <div>
            {activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* 资源统计 */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              资源分布
            </h2>
            <button style={{
              fontSize: '14px',
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}>
              管理资源
            </button>
          </div>
          <ResourceChart stats={resourceStats} />
        </div>
      </div>

      {/* 快速操作 */}
      <div style={{
        marginTop: '24px',
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
          快速操作
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>+</span> 新建项目
          </button>
          <button style={{
            padding: '10px 20px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            上传资源
          </button>
          <button style={{
            padding: '10px 20px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            查看日志
          </button>
          <button style={{
            padding: '10px 20px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            AI 助手
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardApp;
