# Staking 项目配置化架构

## 概述
Staking 模块采用配置化架构，支持快速扩展新的 staking 项目。

## 快速添加新项目

### 1. 在 `staking-config.ts` 中添加项目配置

```typescript
// 1. 更新 StakingProjectId 类型
export type StakingProjectId = 'apriori' | 'magma' | 'your-new-project';

// 2. 在 STAKING_PROJECTS 中添加新项目配置
export const STAKING_PROJECTS: Record<StakingProjectId, Omit<StakingProject, 'useBalance'>> = {
  // ... 现有项目
  'your-new-project': {
    id: 'your-new-project',
    name: 'Your Project Name',
    icon: '/icons/your-project.svg',
    token: YOUR_PROJECT_TOKEN, // 从 @/config/tokens 导入
    exchangeRate: '1 MON = 1 yourToken',
    depositComponent: 'YourProjectDeposit', // Side drawer 组件名
    withdrawComponent: 'YourProjectWithdraw', // Side drawer 组件名
  },
};
```

### 2. 在组件中添加 Balance Hook

在 `stake-tab.tsx` 和 `unstake-tab.tsx` 中添加新的 hook 调用和映射：

**重要：** 必须在组件顶层同时调用所有 hooks（遵循 React Hooks 规则）

```typescript
import { useYourProjectBalance } from '@/lib/data/use-your-project-balance';

export function StakeTab() {
  // ... 现有 state

  // 1. 添加新的 hook 调用（必须在组件顶层）
  const aprioriBalanceResult = useAprioriBalance();
  const magmaBalanceResult = useMagmaBalance();
  const yourProjectBalanceResult = useYourProjectBalance(); // 新增

  // 2. 在 balanceResults 映射中添加
  const balanceResults = {
    apriori: aprioriBalanceResult,
    magma: magmaBalanceResult,
    'your-new-project': yourProjectBalanceResult, // 新增
  };

  // ... 其余代码
}
```

### 3. 确保 Side Drawer 组件已注册

在 `/components/side-drawer/index.tsx` 的 `COMPONENT_MAP` 中确保已添加:

```typescript
const COMPONENT_MAP: Record<SideDrawerComponent, React.ComponentType> = {
  // ... 现有组件
  YourProjectDeposit: YourProjectDeposit,
  YourProjectWithdraw: YourProjectWithdraw,
};
```

### 4. 添加项目图标

将项目图标放到 `/public/icons/your-project.svg`

## 完成！

添加完成后，新项目会自动出现在：
- Stake 选项卡的项目选择器中
- Unstake 选项卡的项目选择器中
- 所有相关功能都会自动工作

## 架构优势

1. **配置化管理**: 所有项目配置集中在 `staking-config.ts`
2. **自动化渲染**: 项目选择器自动根据配置渲染所有项目
3. **类型安全**: TypeScript 确保所有配置正确
4. **易于维护**: 添加/删除项目只需修改配置文件
5. **可扩展**: 支持无限数量的 staking 项目

## 文件结构

```
staking/
├── staking-config.ts       # 项目配置（核心）
├── page.tsx                # 页面入口
├── staking-content.tsx     # Tab 切换容器
├── stake-tab.tsx           # Stake 功能
├── unstake-tab.tsx         # Unstake 功能
└── README.md               # 本文档
```

## 注意事项

1. **React Hooks 规则**: 必须在组件顶层同时调用所有 balance hooks，不能根据条件动态调用
   - ✅ 正确：同时调用所有 hooks，然后根据选择使用对应数据
   - ❌ 错误：根据条件选择性调用不同的 hook
2. 确保 Balance Hook 返回格式一致: `{ data: { balance: string }, isLoading: boolean }`
3. Token 配置需要在 `/config/tokens.ts` 中预先定义
4. Side Drawer 组件需要实现标准接口
5. 图标建议使用 SVG 格式，尺寸 20x20px

## React Hooks 规则说明

**为什么要同时调用所有 hooks？**

React Hooks 的调用顺序必须在每次渲染时保持一致。如果根据条件动态调用不同的 hook，会导致以下错误：

```
Error: React has detected a change in the order of Hooks called
```

**错误示例：**
```typescript
// ❌ 错误：动态选择 hook
const useBalanceHook = BALANCE_HOOKS[selectedProject];
const { data, isLoading } = useBalanceHook();
```

**正确示例：**
```typescript
// ✅ 正确：同时调用所有 hooks
const aprioriBalanceResult = useAprioriBalance();
const magmaBalanceResult = useMagmaBalance();

const balanceResults = {
  apriori: aprioriBalanceResult,
  magma: magmaBalanceResult,
};

const currentBalanceResult = balanceResults[selectedProject];
```
