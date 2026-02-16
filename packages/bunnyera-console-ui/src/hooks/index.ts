// ========================================
// BunnyEra Console UI - Hooks
// ========================================

// 数据获取 Hooks
export { useProjects, useProject } from './useProjects';
export type { UseProjectsReturn, UseProjectReturn } from './useProjects';

export { useResources, useResource } from './useResources';
export type { UseResourcesReturn, UseResourceReturn } from './useResources';

export { useAIHub, useConversation } from './useAIHub';
export type { UseAIHubReturn, UseConversationReturn } from './useAIHub';

export { useLogs, useRealtimeLogs } from './useLogs';
export type { UseLogsReturn, UseRealtimeLogsReturn } from './useLogs';

export { useCurrentUser, useAuth, usePermissions } from './useCurrentUser';
export type { 
  UseCurrentUserReturn, 
  UserPreferences,
  UseAuthReturn,
  UsePermissionsReturn,
  Permission,
} from './useCurrentUser';

// ========================================
// 通用工具 Hooks
// ========================================

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 使用本地存储
 * @param key 存储键
 * @param initialValue 初始值
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * 使用防抖
 * @param value 值
 * @param delay 延迟时间
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 使用节流
 * @param callback 回调函数
 * @param delay 延迟时间
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCall = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}

/**
 * 使用点击外部
 * @param handler 处理函数
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]);

  return ref;
}

/**
 * 使用窗口大小
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * 使用媒体查询
 * @param query 媒体查询字符串
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatch = () => setMatches(media.matches);
    updateMatch();

    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}

/**
 * 使用键盘事件
 * @param targetKey 目标按键
 * @param callback 回调函数
 */
export function useKeyPress(targetKey: string, callback: () => void): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetKey, callback]);
}

/**
 * 使用异步操作
 * @param asyncFunction 异步函数
 * @param immediate 是否立即执行
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = true
): {
  execute: () => Promise<void>;
  status: 'idle' | 'pending' | 'success' | 'error';
  value: T | null;
  error: E | null;
} {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
    } catch (err) {
      setError(err as E);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

/**
 * 使用上一次值
 * @param value 当前值
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * 使用计数器
 * @param initialValue 初始值
 */
export function useCounter(initialValue = 0): {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
} {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value: number) => setCount(value), []);

  return { count, increment, decrement, reset, set };
}

/**
 * 使用布尔值
 * @param initialValue 初始值
 */
export function useBoolean(initialValue = false): {
  value: boolean;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
  set: (value: boolean) => void;
} {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);

  return { value, setTrue, setFalse, toggle, set: setValue };
}

/**
 * 使用数组
 * @param initialValue 初始值
 */
export function useArray<T>(initialValue: T[] = []): {
  value: T[];
  add: (item: T) => void;
  remove: (index: number) => void;
  removeById: (id: string, key?: keyof T) => void;
  update: (index: number, item: T) => void;
  clear: () => void;
  set: (value: T[]) => void;
} {
  const [value, setValue] = useState<T[]>(initialValue);

  const add = useCallback((item: T) => {
    setValue((v) => [...v, item]);
  }, []);

  const remove = useCallback((index: number) => {
    setValue((v) => v.filter((_, i) => i !== index));
  }, []);

  const removeById = useCallback((id: string, key: keyof T = 'id' as keyof T) => {
    setValue((v) => v.filter((item) => (item[key] as unknown) !== id));
  }, []);

  const update = useCallback((index: number, item: T) => {
    setValue((v) => {
      const newValue = [...v];
      newValue[index] = item;
      return newValue;
    });
  }, []);

  const clear = useCallback(() => {
    setValue([]);
  }, []);

  return { value, add, remove, removeById, update, clear, set: setValue };
}

/**
 * 使用挂载状态
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}

/**
 * 使用深色模式
 */
export function useDarkMode(): {
  isDark: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
} {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const newValue = !prev;
      document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  }, []);

  const set = useCallback((value: boolean) => {
    setIsDark(value);
    document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
  }, []);

  return { isDark, toggle, set };
}
