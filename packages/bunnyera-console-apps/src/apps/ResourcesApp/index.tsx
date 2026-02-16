// ============================================
// ResourcesApp - 资源中心
// ============================================

import React, { useEffect, useState } from 'react';
import { mockApi } from '../../core';
import type { Resource, ResourceGroup, ResourceType } from '../../types';

// 资源类型图标
const typeIcons: Record<ResourceType, string> = {
  file: '📄',
  image: '🖼️',
  video: '🎬',
  domain: '🌐',
  server: '🖥️',
  database: '🗄️',
};

const typeLabels: Record<ResourceType, string> = {
  file: '文件',
  image: '图片',
  video: '视频',
  domain: '域名',
  server: '服务器',
  database: '数据库',
};

// 格式化文件大小
const formatSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === 0) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// 资源卡片组件
interface ResourceCardProps {
  resource: Resource;
  onClick: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#3b82f6';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e5e7eb';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        background: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        flexShrink: 0,
      }}>
        {typeIcons[resource.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: '600',
          color: '#111827',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {resource.name}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
          {typeLabels[resource.type]} · {formatSize(resource.size)}
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {resource.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontSize: '10px',
              padding: '2px 6px',
              background: '#eff6ff',
              color: '#3b82f6',
              borderRadius: '4px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// 资源详情面板
interface ResourceDetailPanelProps {
  resource: Resource | null;
  onClose: () => void;
}

const ResourceDetailPanel: React.FC<ResourceDetailPanelProps> = ({ resource, onClose }) => {
  if (!resource) {
    return (
      <div style={{
        background: '#f9fafb',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: '#9ca3af',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
        <div>选择一个资源查看详情</div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    }}>
      {/* 头部 */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>{typeIcons[resource.type]}</div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 4px 0',
              wordBreak: 'break-all',
            }}>
              {resource.name}
            </h2>
            <span style={{
              fontSize: '12px',
              padding: '2px 10px',
              background: '#eff6ff',
              color: '#3b82f6',
              borderRadius: '9999px',
            }}>
              {typeLabels[resource.type]}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            background: '#f3f4f6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          ×
        </button>
      </div>

      {/* 内容 */}
      <div style={{ padding: '24px' }}>
        {/* 基本信息 */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
            基本信息
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>大小</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>{formatSize(resource.size)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>状态</span>
              <span style={{
                fontSize: '12px',
                padding: '2px 10px',
                background: resource.status === 'active' ? '#dcfce7' : '#f3f4f6',
                color: resource.status === 'active' ? '#16a34a' : '#6b7280',
                borderRadius: '9999px',
              }}>
                {resource.status === 'active' ? '正常' : '停用'}
              </span>
            </div>
            {resource.path && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>路径</span>
                <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'monospace' }}>
                  {resource.path}
                </span>
              </div>
            )}
            {resource.url && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>URL</span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none' }}
                >
                  访问 →
                </a>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>创建时间</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>
                {new Date(resource.createdAt).toLocaleString('zh-CN')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>更新时间</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>
                {new Date(resource.updatedAt).toLocaleString('zh-CN')}
              </span>
            </div>
          </div>
        </div>

        {/* 标签 */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
            标签
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {resource.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '12px',
                padding: '4px 12px',
                background: '#f3f4f6',
                color: '#374151',
                borderRadius: '6px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 元数据 */}
        {resource.metadata && Object.keys(resource.metadata).length > 0 && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
              元数据
            </h4>
            <div style={{
              background: '#f9fafb',
              borderRadius: '8px',
              padding: '16px',
            }}>
              {Object.entries(resource.metadata).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{key}</span>
                  <span style={{ fontSize: '13px', color: '#374151', fontFamily: 'monospace' }}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '12px',
      }}>
        <button style={{
          flex: 1,
          padding: '10px 20px',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          编辑
        </button>
        <button style={{
          padding: '10px 20px',
          background: '#fee2e2',
          color: '#dc2626',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          删除
        </button>
      </div>
    </div>
  );
};

// ============================================
// ResourcesApp 主组件
// ============================================

export interface ResourcesAppProps {
  className?: string;
}

export const ResourcesApp: React.FC<ResourcesAppProps> = ({ className }) => {
  const [groups, setGroups] = useState<ResourceGroup[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<ResourceType | 'all'>('all');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await mockApi.resources.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await mockApi.resources.getList({ search: searchQuery });
      // 转换为分组格式
      const grouped: Record<ResourceType, Resource[]> = {
        file: [], image: [], video: [], domain: [], server: [], database: [],
      };
      data.forEach(r => grouped[r.type].push(r));
      setGroups([
        { type: 'file', label: '文件', count: grouped.file.length, resources: grouped.file },
        { type: 'image', label: '图片', count: grouped.image.length, resources: grouped.image },
        { type: 'video', label: '视频', count: grouped.video.length, resources: grouped.video },
        { type: 'domain', label: '域名', count: grouped.domain.length, resources: grouped.domain },
        { type: 'server', label: '服务器', count: grouped.server.length, resources: grouped.server },
        { type: 'database', label: '数据库', count: grouped.database.length, resources: grouped.database },
      ]);
    } catch (error) {
      console.error('Failed to search resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤显示的分组
  const displayGroups = activeType === 'all'
    ? groups.filter(g => g.count > 0)
    : groups.filter(g => g.type === activeType);

  // 计算总数
  const totalCount = groups.reduce((sum, g) => sum + g.count, 0);

  return (
    <div className={className} style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
          资源中心
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>管理您的所有资源文件</p>
      </div>

      {/* 搜索栏 */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="搜索资源..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            搜索
          </button>
        </div>

        <div style={{ flex: 1 }} />

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
          <span>+</span> 上传资源
        </button>
      </div>

      {/* 类型筛选标签 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveType('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '14px',
            border: 'none',
            cursor: 'pointer',
            background: activeType === 'all' ? '#3b82f6' : '#f3f4f6',
            color: activeType === 'all' ? '#fff' : '#374151',
          }}
        >
          全部 ({totalCount})
        </button>
        {groups.map(group => (
          <button
            key={group.type}
            onClick={() => setActiveType(group.type)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              background: activeType === group.type ? '#3b82f6' : '#f3f4f6',
              color: activeType === group.type ? '#fff' : '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{typeIcons[group.type]}</span>
            {group.label} ({group.count})
          </button>
        ))}
      </div>

      {/* 主内容区 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedResource ? '1fr 360px' : '1fr',
        gap: '24px',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* 资源列表 */}
        <div style={{ overflow: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
              <div>加载中...</div>
            </div>
          ) : displayGroups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <div>暂无资源</div>
            </div>
          ) : (
            <div>
              {displayGroups.map(group => (
                <div key={group.type} style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>{typeIcons[group.type]}</span>
                    {group.label}
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 10px',
                      background: '#f3f4f6',
                      color: '#6b7280',
                      borderRadius: '9999px',
                    }}>
                      {group.count}
                    </span>
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                  }}>
                    {group.resources.map(resource => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onClick={() => setSelectedResource(resource)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 详情面板 */}
        {selectedResource && (
          <div style={{ overflow: 'auto' }}>
            <ResourceDetailPanel
              resource={selectedResource}
              onClose={() => setSelectedResource(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesApp;
