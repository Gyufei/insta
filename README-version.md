# 版本管理系统

## 功能概述

本项目实现了智能版本管理和缓存更新检测系统，解决Vercel部署后的缓存问题。

## 核心特性

### 🔧 自动版本递增
- **基于Git提交**：每次新的提交会自动递增版本号
- **智能递增类型**：根据commit message自动决定递增类型
  - `feat:` 或 `feature:` 或 `minor:` → minor版本递增
  - `breaking` 或 `major:` → major版本递增
  - 其他情况 → patch版本递增

### 📦 构建时版本生成
- 基于git commit hash和时间戳生成唯一版本标识
- 自动更新package.json版本号
- 生成`public/version.json`供前端检测使用

### 🔍 运行时版本检测
- 定期检查新版本（默认30分钟）
- 页面重新激活时检查更新
- 支持手动检查和错误处理

### 🔄 智能缓存刷新
- 检测到新版本时弹窗提醒用户
- 支持立即刷新或稍后提醒
- 清除所有缓存并执行硬刷新

## 使用命令

```bash
# 自动生成版本文件
npm run generate-version

# 手动递增版本
npm run version:patch   # 0.1.0 → 0.1.1
npm run version:minor   # 0.1.0 → 0.2.0
npm run version:major   # 0.1.0 → 1.0.0

# 构建（会自动生成版本）
npm run build
```

## 版本文件格式

```json
{
  "version": "0.1.0",
  "gitHash": "f6a5c259",
  "fullGitHash": "f6a5c2599e76601d8a58a6d0e2fd768a586ed597",
  "buildTimestamp": 1758769814009,
  "buildDate": "2025-09-25T03:10:14.009Z",
  "buildId": "0.1.0-f6a5c259-1758769814009"
}
```

## 组件使用

```tsx
import { VersionUpdateNotification } from '@/components/version';

// 在根布局中使用
<VersionUpdateProvider>
  <App />
  <VersionUpdateNotification />
</VersionUpdateProvider>
```

## Hook使用

```tsx
import { useVersionCheck } from '@/lib/hooks/use-version-check';

function MyComponent() {
  const {
    currentVersion,
    hasUpdate,
    forceRefresh
  } = useVersionCheck();

  if (hasUpdate) {
    return <button onClick={forceRefresh}>更新到新版本</button>;
  }
}
```

这样就完美解决了Vercel部署的缓存问题！🎉