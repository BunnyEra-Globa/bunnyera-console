// ============================================
// ProjectsApp - 项目中心
// ============================================

import React, { useEffect, useState } from 'react';
import { mockApi } from '../../core';
import type { Project, ProjectDetail, Status } from '../../types';

// 状态标签组件
interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<Status, { label: string; bg: string; color: string }> = {
    active: { label: '进行中', bg: '#dbeafe', color: '#1d4ed8' },
    inactive: { label: '已暂停', bg: '#f3f4f6', color: '#6b7280' },
    pending: { label: '待开始', bg: '#fef3c7', color: '#d97706' },
    error: { label: '异常', bg: '#fee2e2', color: '#dc2626' },
    success: { label: '已完成', bg: '#dcfce7', color: '#16a34a' },
  };

  const config = statusConfig[status];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '500',
      background: config.bg,
      color: config.color,
    }}>
      {config.label}
    </span>
  );
};

// 进度条组件
interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{
      flex: 1,
      height: '6px',
      background: '#e5e7eb',
      borderRadius: '3px',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: progress === 100 ? '#10b981' : '#3b82f6',
        borderRadius: '3px',
        transition: 'width 0.3s ease',
      }} />
    </div>
    <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '36px' }}>{progress}%</span>
  </div>
);

// 项目卡片组件
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isSelected: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, isSelected }) => (
  <div
    onClick={onClick}
    style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: isSelected ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
    }}
    onMouseEnter={(e) => {
      if (!isSelected) {
        e.currentTarget.style.borderColor = '#d1d5db';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isSelected) {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
      }
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <StatusBadge status={project.status} />
      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
        {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
      </span>
    </div>

    <h3 style={{
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 8px 0',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>
      {project.name}
    </h3>

    <p style={{
      fontSize: '14px',
      color: '#6b7280',
      margin: '0 0 16px 0',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      lineHeight: '1.5',
    }}>
      {project.description}
    </p>

    <div style={{ marginBottom: '16px' }}>
      <ProgressBar progress={project.progress} />
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {project.tags.slice(0, 2).map(tag => (
          <span key={tag} style={{
            fontSize: '11px',
            padding: '2px 8px',
            background: '#f3f4f6',
            color: '#6b7280',
            borderRadius: '4px',
          }}>
            {tag}
          </span>
        ))}
        {project.tags.length > 2 && (
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            background: '#f3f4f6',
            color: '#6b7280',
            borderRadius: '4px',
          }}>
            +{project.tags.length - 2}
          </span>
        )}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#6b7280',
      }}>
        <span>👤</span>
        {project.owner}
      </div>
    </div>

    {project.deadline && (
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #f3f4f6',
        fontSize: '12px',
        color: '#6b7280',
      }}>
        截止: {new Date(project.deadline).toLocaleDateString('zh-CN')}
      </div>
    )}
  </div>
);

// 项目详情面板
interface ProjectDetailPanelProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

const ProjectDetailPanel: React.FC<ProjectDetailPanelProps> = ({ project, onClose }) => {
  if (!project) {
    return (
      <div style={{
        background: '#f9fafb',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: '#9ca3af',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
        <div>选择一个项目查看详情</div>
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
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
            {project.name}
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{project.description}</p>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>状态</div>
              <StatusBadge status={project.status} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>负责人</div>
              <div style={{ fontSize: '14px', color: '#374151' }}>{project.owner}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>进度</div>
              <ProgressBar progress={project.progress} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>截止日期</div>
              <div style={{ fontSize: '14px', color: '#374151' }}>
                {project.deadline ? new Date(project.deadline).toLocaleDateString('zh-CN') : '未设置'}
              </div>
            </div>
          </div>
        </div>

        {/* 标签 */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
            标签
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '12px',
                padding: '4px 12px',
                background: '#eff6ff',
                color: '#3b82f6',
                borderRadius: '6px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 成员 */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
            团队成员 ({project.members.length})
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            {project.members.map((member, index) => (
              <div key={index} style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: `hsl(${(index * 60) % 360}, 70%, 80%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                {member.charAt(0)}
              </div>
            ))}
          </div>
        </div>

        {/* 资源 */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
            关联资源 ({project.resources.length})
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            {project.resources.map((res, index) => (
              <div key={index} style={{
                padding: '8px 16px',
                background: '#f9fafb',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#6b7280',
              }}>
                {res}
              </div>
            ))}
          </div>
        </div>

        {/* 备注 */}
        {project.notes && (
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
              备注
            </h4>
            <div style={{
              padding: '16px',
              background: '#fefce8',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#713f12',
              lineHeight: '1.6',
            }}>
              {project.notes}
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
          编辑项目
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
// ProjectsApp 主组件
// ============================================

export interface ProjectsAppProps {
  className?: string;
}

export const ProjectsApp: React.FC<ProjectsAppProps> = ({ className }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string>('');

  const statusOptions: { value: Status | 'all'; label: string }[] = [
    { value: 'all', label: '全部状态' },
    { value: 'active', label: '进行中' },
    { value: 'pending', label: '待开始' },
    { value: 'success', label: '已完成' },
    { value: 'inactive', label: '已暂停' },
    { value: 'error', label: '异常' },
  ];

  useEffect(() => {
    loadProjects();
  }, [statusFilter, tagFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const filters: { status?: Status; tags?: string[] } = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (tagFilter) filters.tags = [tagFilter];

      const data = await mockApi.projects.getList(filters);
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (projectId: string) => {
    const detail = await mockApi.projects.getById(projectId);
    setSelectedProject(detail);
  };

  // 获取所有标签
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  return (
    <div className={className} style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
          项目中心
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>管理和跟踪您的所有项目</p>
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '14px',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="">全部标签</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

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
          <span>+</span> 新建项目
        </button>
      </div>

      {/* 主内容区 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedProject ? '1fr 380px' : '1fr',
        gap: '24px',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* 项目列表 */}
        <div style={{ overflow: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
              <div>加载中...</div>
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
              <div>暂无项目</div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project.id)}
                  isSelected={selectedProject?.id === project.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* 详情面板 */}
        {selectedProject && (
          <div style={{ overflow: 'auto' }}>
            <ProjectDetailPanel
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsApp;
