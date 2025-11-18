# 添加新 Staking 项目示例

## 场景：添加一个名为 "Nebula" 的新 staking 项目

### 步骤 1: 定义 Token（如果还没有）

在 `/config/tokens.ts` 中添加：

```typescript
export const N_MONAD = {
  address: '0x...',
  name: 'nMON',
  symbol: 'nMON',
  logo: '/icons/nmon.svg',
  decimals: 18,
  description: 'Staking Token on Monad Nebula',
};
```

### 步骤 2: 创建 Balance Hook

创建 `/lib/data/use-nebula-balance.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';

export function useNebulaBalance() {
  return useQuery({
    queryKey: ['nebula-balance'],
    queryFn: async () => {
      // 实现你的数据获取逻辑
      const response = await fetch('/api/nebula/balance');
      const data = await response.json();
      return { balance: data.balance };
    },
  });
}
```

### 步骤 3: 创建 Deposit/Withdraw 组件

创建 `/app/(protocols)/nebula/nebula-deposit/index.tsx`:

```typescript
export function NebulaDeposit() {
  // 实现 deposit 逻辑
  return <div>Nebula Deposit Component</div>;
}
```

创建 `/app/(protocols)/nebula/nebula-withdraw/index.tsx`:

```typescript
export function NebulaWithdraw() {
  // 实现 withdraw 逻辑
  return <div>Nebula Withdraw Component</div>;
}
```

### 步骤 4: 注册 Side Drawer 组件

在 `/components/side-drawer/index.tsx` 中：

```typescript
import { NebulaDeposit } from '@/app/(protocols)/nebula/nebula-deposit';
import { NebulaWithdraw } from '@/app/(protocols)/nebula/nebula-withdraw';

// 添加到类型定义
type SideDrawerComponent =
  | 'Balance'
  | 'AprioriDeposit'
  | 'AprioriWithdraw'
  | 'MagmaDeposit'
  | 'MagmaWithdraw'
  | 'NebulaDeposit'    // 新增
  | 'NebulaWithdraw';  // 新增

const COMPONENT_MAP: Record<SideDrawerComponent, React.ComponentType> = {
  // ... 现有组件
  NebulaDeposit: NebulaDeposit,
  NebulaWithdraw: NebulaWithdraw,
};
```

### 步骤 5: 更新 Staking 配置

在 `/app/(protocols)/staking/staking-config.ts` 中：

```typescript
import { N_MONAD } from '@/config/tokens';

// 1. 更新类型
export type StakingProjectId = 'apriori' | 'magma' | 'nebula';

// 2. 添加配置
export const STAKING_PROJECTS: Record<StakingProjectId, Omit<StakingProject, 'useBalance'>> = {
  apriori: { /* ... */ },
  magma: { /* ... */ },
  nebula: {
    id: 'nebula',
    name: 'Nebula',
    icon: '/icons/nebula.svg',
    token: N_MONAD,
    exchangeRate: '1 MON = 1 nMON',
    depositComponent: 'NebulaDeposit',
    withdrawComponent: 'NebulaWithdraw',
  },
};
```

### 步骤 6: 添加 Balance Hook 调用和映射

在 `/app/(protocols)/staking/stake-tab.tsx` 中：

```typescript
import { useNebulaBalance } from '@/lib/data/use-nebula-balance';

export function StakeTab() {
  const [selectedProject, setSelectedProject] = useState<StakingProjectId>('apriori');
  const { setCurrentComponent } = useSideDrawerStore();

  // 同时调用所有 hooks（遵循 React Hooks 规则）
  const aprioriBalanceResult = useAprioriBalance();
  const magmaBalanceResult = useMagmaBalance();
  const nebulaBalanceResult = useNebulaBalance(); // 新增这一行

  const project = getStakingProject(selectedProject);

  // 根据选择的项目使用对应的数据
  const balanceResults = {
    apriori: aprioriBalanceResult,
    magma: magmaBalanceResult,
    nebula: nebulaBalanceResult, // 新增这一行
  };

  const currentBalanceResult = balanceResults[selectedProject];
  const balance = currentBalanceResult.data?.balance || '0';
  const isLoading = currentBalanceResult.isLoading;

  // ... 其余代码
}
```

在 `unstake-tab.tsx` 中做同样的修改。

### 步骤 7: 添加图标

将 `/public/icons/nebula.svg` 图标文件放到对应位置。

## 完成！

现在 "Nebula" 项目会自动显示在 Staking 页面的项目选择器中，所有功能自动生效。

## 对比：配置化 vs 硬编码

### 之前的方式（硬编码）：
```typescript
// 每添加一个项目都要修改多处
const isApriori = selectedToken === 'apriori';
const token = isApriori ? APR_MONAD : G_MONAD;
const balance = isApriori ? aprioriBalance?.balance : magmaBalance?.balance;
// 添加第三个项目时需要改成复杂的三元表达式
```

### 现在的方式（配置化）：
```typescript
// 只需在配置文件添加一个条目
const project = getStakingProject(selectedProject);
const useBalanceHook = BALANCE_HOOKS[selectedProject];
const { data: balanceData } = useBalanceHook();
// 自动支持任意数量的项目
```

## 优势总结

1. ✅ 添加新项目只需修改 2-3 个文件
2. ✅ 不需要修改组件的核心逻辑
3. ✅ 类型安全，编译时检查
4. ✅ 项目选择器自动更新
5. ✅ 易于维护和测试
6. ✅ 代码更简洁、可读性更高
