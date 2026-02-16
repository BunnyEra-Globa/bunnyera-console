// ============================================
// NotesApp - 笔记
// ============================================

import React, { useEffect, useState } from 'react';
import { mockApi } from '../../core';
import type { Note } from '../../types';

// 笔记列表项组件
interface NoteListItemProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const NoteListItem: React.FC<NoteListItemProps> = ({ note, isActive, onClick, onDelete }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  // 获取内容预览（去除 Markdown 标记）
  const getPreview = (content: string) => {
    return content
      .replace(/#+ /g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`{3}[\s\S]*?`{3}/g, '[代码块]')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 80);
  };

  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        borderRadius: '10px',
        cursor: 'pointer',
        background: isActive ? '#eff6ff' : note.color || '#fff',
        border: `1px solid ${isActive ? '#bfdbfe' : 'transparent'}`,
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = note.color ? note.color : '#f9fafb';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = note.color || '#fff';
        }
      }}
    >
      {/* 置顶标记 */}
      {note.isPinned && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '14px',
        }}>
          📌
        </div>
      )}

      <div style={{
        fontWeight: '600',
        color: '#111827',
        marginBottom: '6px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        paddingRight: note.isPinned ? '24px' : 0,
      }}>
        {note.title || '无标题'}
      </div>

      <div style={{
        fontSize: '13px',
        color: '#6b7280',
        marginBottom: '10px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        lineHeight: '1.4',
      }}>
        {getPreview(note.content) || '无内容'}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {note.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontSize: '10px',
              padding: '2px 8px',
              background: 'rgba(0,0,0,0.05)',
              color: '#6b7280',
              borderRadius: '4px',
            }}>
              {tag}
            </span>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
          {formatDate(note.updatedAt)}
        </span>
      </div>

      {/* 删除按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fee2e2';
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.opacity = '0';
        }}
      >
        🗑️
      </button>
    </div>
  );
};

// ============================================
// NotesApp 主组件
// ============================================

export interface NotesAppProps {
  className?: string;
}

export const NotesApp: React.FC<NotesAppProps> = ({ className }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 编辑状态
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await mockApi.notes.getList();
      setNotes(data);
      if (data.length > 0 && !activeNote) {
        selectNote(data[0]);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectNote = (note: Note) => {
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setHasChanges(false);
  };

  const handleCreateNote = async () => {
    const newNote = await mockApi.notes.create({
      title: '新笔记',
      content: '',
      tags: [],
      isPinned: false,
      color: '#fff',
    });
    setNotes([newNote, ...notes]);
    selectNote(newNote);
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;

    const updated = await mockApi.notes.update(activeNote.id, {
      title: editTitle,
      content: editContent,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
    });

    if (updated) {
      setNotes(notes.map(n => n.id === updated.id ? updated : n));
      setActiveNote(updated);
      setHasChanges(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('确定要删除这条笔记吗？')) return;

    const success = await mockApi.notes.delete(noteId);
    if (success) {
      const remaining = notes.filter(n => n.id !== noteId);
      setNotes(remaining);
      if (activeNote?.id === noteId) {
        if (remaining.length > 0) {
          selectNote(remaining[0]);
        } else {
          setActiveNote(null);
          setEditTitle('');
          setEditContent('');
          setEditTags('');
        }
      }
    }
  };

  const handleTogglePin = async () => {
    if (!activeNote) return;

    const updated = await mockApi.notes.update(activeNote.id, {
      isPinned: !activeNote.isPinned,
    });

    if (updated) {
      setNotes(notes.map(n => n.id === updated.id ? updated : n).sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return a.isPinned ? -1 : 1;
      }));
      setActiveNote(updated);
    }
  };

  // 过滤笔记
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 检测变化
  const checkChanges = () => {
    if (!activeNote) return;
    const tagsChanged = editTags.split(',').map(t => t.trim()).filter(Boolean).join(',') !==
      activeNote.tags.join(',');
    setHasChanges(
      editTitle !== activeNote.title ||
      editContent !== activeNote.content ||
      tagsChanged
    );
  };

  useEffect(() => {
    checkChanges();
  }, [editTitle, editContent, editTags]);

  // 颜色选项
  const colorOptions = [
    { value: '#fff', label: '白色' },
    { value: '#fff9c4', label: '黄色' },
    { value: '#e3f2fd', label: '蓝色' },
    { value: '#f3e5f5', label: '紫色' },
    { value: '#e8f5e9', label: '绿色' },
    { value: '#ffebee', label: '红色' },
  ];

  return (
    <div className={className} style={{ height: '100%', display: 'flex' }}>
      {/* 左侧笔记列表 */}
      <div style={{
        width: '320px',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        background: '#f9fafb',
      }}>
        {/* 头部 */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 12px 0',
          }}>
            笔记
          </h2>

          {/* 搜索 */}
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              marginBottom: '12px',
              boxSizing: 'border-box',
            }}
          />

          <button
            onClick={handleCreateNote}
            style={{
              width: '100%',
              padding: '10px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>+</span> 新建笔记
          </button>
        </div>

        {/* 笔记列表 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <div style={{ fontSize: '13px' }}>加载中...</div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
              <div style={{ fontSize: '13px' }}>
                {searchQuery ? '没有找到匹配的笔记' : '暂无笔记'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredNotes.map(note => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isActive={activeNote?.id === note.id}
                  onClick={() => selectNote(note)}
                  onDelete={() => handleDeleteNote(note.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 统计 */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center',
        }}>
          共 {notes.length} 条笔记
        </div>
      </div>

      {/* 右侧编辑区 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
      }}>
        {activeNote ? (
          <>
            {/* 工具栏 */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleTogglePin}
                  style={{
                    padding: '8px 12px',
                    background: activeNote.isPinned ? '#fef3c7' : '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: activeNote.isPinned ? '#d97706' : '#374151',
                  }}
                >
                  {activeNote.isPinned ? '📌 已置顶' : '📌 置顶'}
                </button>

                {/* 颜色选择 */}
                <select
                  value={activeNote.color || '#fff'}
                  onChange={async (e) => {
                    const updated = await mockApi.notes.update(activeNote.id, {
                      color: e.target.value,
                    });
                    if (updated) {
                      setNotes(notes.map(n => n.id === updated.id ? updated : n));
                      setActiveNote(updated);
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {colorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {hasChanges && (
                  <span style={{
                    fontSize: '13px',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    ● 有未保存的更改
                  </span>
                )}
                <button
                  onClick={handleSaveNote}
                  disabled={!hasChanges}
                  style={{
                    padding: '8px 20px',
                    background: hasChanges ? '#3b82f6' : '#e5e7eb',
                    color: hasChanges ? '#fff' : '#9ca3af',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: hasChanges ? 'pointer' : 'not-allowed',
                  }}
                >
                  保存
                </button>
              </div>
            </div>

            {/* 编辑区域 */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              overflow: 'auto',
            }}>
              {/* 标题输入 */}
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="笔记标题"
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#111827',
                  border: 'none',
                  borderBottom: '1px solid #e5e7eb',
                  padding: '0 0 12px 0',
                  marginBottom: '16px',
                  outline: 'none',
                  background: 'transparent',
                }}
              />

              {/* 标签输入 */}
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="标签，用逗号分隔"
                style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  border: 'none',
                  padding: '0 0 12px 0',
                  marginBottom: '16px',
                  outline: 'none',
                  background: 'transparent',
                }}
              />

              {/* 内容输入 */}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="开始写作...（支持 Markdown）"
                style={{
                  flex: 1,
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: '#374151',
                  border: 'none',
                  resize: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* 底部信息 */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid #e5e7eb',
              fontSize: '12px',
              color: '#9ca3af',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>
                创建于 {new Date(activeNote.createdAt).toLocaleString('zh-CN')}
              </span>
              <span>
                更新于 {new Date(activeNote.updatedAt).toLocaleString('zh-CN')}
              </span>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>选择一个笔记开始编辑</div>
              <div style={{ fontSize: '14px' }}>或创建一个新笔记</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
