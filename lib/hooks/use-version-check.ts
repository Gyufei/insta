'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface VersionInfo {
  version: string;
  gitHash: string;
  fullGitHash: string;
  buildTimestamp: number;
  buildDate: string;
  buildId: string;
}

interface UseVersionCheckOptions {
  checkInterval?: number; // 检查间隔，默认30分钟
  enableAutoCheck?: boolean; // 是否启用自动检查，默认true
  onNewVersionDetected?: (newVersion: VersionInfo, currentVersion: VersionInfo) => void;
  onError?: (error: Error) => void;
}

interface UseVersionCheckReturn {
  currentVersion: VersionInfo | null;
  latestVersion: VersionInfo | null;
  hasUpdate: boolean;
  isChecking: boolean;
  error: string | null;
  checkForUpdates: () => Promise<void>;
  forceRefresh: () => void;
  dismissUpdate: () => void;
}

const VERSION_STORAGE_KEY = 'app-version-info';
const UPDATE_DISMISSED_KEY = 'version-update-dismissed';
const DEFAULT_CHECK_INTERVAL = 30 * 60 * 1000; // 30分钟

export function useVersionCheck(options: UseVersionCheckOptions = {}): UseVersionCheckReturn {
  const {
    checkInterval = DEFAULT_CHECK_INTERVAL,
    enableAutoCheck = true,
    onNewVersionDetected,
    onError,
  } = options;

  const [currentVersion, setCurrentVersion] = useState<VersionInfo | null>(null);
  const [latestVersion, setLatestVersion] = useState<VersionInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentVersionRef = useRef<VersionInfo | null>(null);

  // 同步 currentVersion 到 ref
  useEffect(() => {
    currentVersionRef.current = currentVersion;
  }, [currentVersion]);

  // 获取当前版本信息
  const getCurrentVersion = useCallback(async (): Promise<VersionInfo | null> => {
    try {
      const response = await fetch('/version.json', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch version info: ${response.status}`);
      }

      const versionInfo = await response.json();
      return versionInfo;
    } catch (err) {
      console.warn('Failed to get current version:', err);
      return null;
    }
  }, []);

  // 检查远程版本更新
  const checkForUpdates = useCallback(async (): Promise<void> => {
    if (isChecking) return;

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsChecking(true);
    setError(null);

    try {
      // 添加随机参数防止缓存
      const timestamp = Date.now();
      const response = await fetch(`/version.json?t=${timestamp}`, {
        cache: 'no-cache',
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const remoteVersion: VersionInfo = await response.json();
      setLatestVersion(remoteVersion);

      // 检查是否有更新 - 使用 ref 获取最新的 currentVersion 避免依赖项循环
      const current = currentVersionRef.current;
      if (current && remoteVersion.buildId !== current.buildId) {
        // 检查是否已经忽略了这个版本的更新
        const dismissedVersion = localStorage.getItem(UPDATE_DISMISSED_KEY);
        const shouldShowUpdate = dismissedVersion !== remoteVersion.buildId;

        setHasUpdate(shouldShowUpdate);

        if (shouldShowUpdate && onNewVersionDetected) {
          onNewVersionDetected(remoteVersion, current);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // 请求被取消，不处理
      }

      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Version check failed:', err);

      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsChecking(false);
    }
  }, [onNewVersionDetected, onError]); // 移除 currentVersion 和 isChecking 依赖

  // 强制刷新页面
  const forceRefresh = useCallback(() => {
    if (typeof window !== 'undefined') {
      // 清除所有缓存
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
        });
      }

      // 强制硬刷新
      window.location.reload();
    }
  }, []);

  // 忽略当前版本更新
  const dismissUpdate = useCallback(() => {
    if (latestVersion) {
      localStorage.setItem(UPDATE_DISMISSED_KEY, latestVersion.buildId);
    }
    setHasUpdate(false);
  }, [latestVersion]);

  // 初始化：获取当前版本信息
  useEffect(() => {
    getCurrentVersion().then((version) => {
      if (version) {
        setCurrentVersion(version);

        // 保存到localStorage用于比较
        localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(version));

        // 首次检查更新
        if (enableAutoCheck) {
          setTimeout(() => checkForUpdates(), 1000); // 延迟1秒执行首次检查
        }
      }
    });
  }, [getCurrentVersion, enableAutoCheck]); // 移除 checkForUpdates 依赖，避免循环

  // 设置定时检查
  useEffect(() => {
    if (!enableAutoCheck || !currentVersion) {
      return;
    }

    intervalRef.current = setInterval(() => {
      // 只有当 currentVersionRef.current 存在时才执行检查
      if (currentVersionRef.current) {
        checkForUpdates();
      }
    }, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableAutoCheck, currentVersion, checkInterval]); // 保留 currentVersion 依赖用于启动/停止定时器

  // 页面可见性变化时检查更新
  useEffect(() => {
    if (!enableAutoCheck) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentVersionRef.current) {
        // 页面重新变为可见时检查更新
        setTimeout(() => checkForUpdates(), 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableAutoCheck]); // 移除 currentVersion 和 checkForUpdates 依赖，避免循环

  // 清理函数
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    currentVersion,
    latestVersion,
    hasUpdate,
    isChecking,
    error,
    checkForUpdates,
    forceRefresh,
    dismissUpdate,
  };
}