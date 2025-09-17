# 数据分析指南

本文档提供了 Tadle 应用中 Google Analytics 4 (GA4) 实现的完整指南。

## 概述

数据分析系统使用 `@next/third-parties/google` 包来跟踪用户交互、交易活动和应用使用模式。这帮助我们了解用户行为并改善应用体验。

## 安装配置

### 安装

数据分析系统已安装和配置:

```bash
pnpm add @next/third-parties
```

### 配置

#### 1. 环境变量

在环境变量中添加您的 Google Analytics 4 跟踪 ID:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### 2. 布局集成

Google Analytics 组件已集成在根布局中 (`app/layout.tsx`):

```tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* 您的应用内容 */}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
```

## 分析系统实现

### 核心分析模块

位置: `lib/analytics/index.ts`

该模块提供:
- 事件跟踪工具
- 预定义事件常量
- 常见跟踪场景的辅助函数

### 主要功能

#### 1. 事件跟踪
```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('TRADE_INITIATED', {
  event_category: 'trading',
  token_symbol: 'ETH',
  value: 100,
});
```

#### 2. 页面浏览跟踪
```typescript
import { trackPageView } from '@/lib/analytics';

trackPageView('/trade', '交易页面');
```

#### 3. 用户属性
```typescript
import { setUserProperties } from '@/lib/analytics';

setUserProperties({
  account_type: 'DSA',
  preferred_network: 'monad',
});
```

## 跟踪事件

### 钱包和账户事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `WALLET_CONNECT` | 用户连接钱包 | `account_type`, `wallet_address` (匿名化) |
| `WALLET_DISCONNECT` | 用户断开钱包 | `event_category` |
| `ACCOUNT_SWITCH` | 用户在 EOA/DSA 之间切换 | `from_type`, `to_type` |

### 交易事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `TRADE_INITIATED` | 用户开始交易 | `sell_token`, `buy_token`, `trade_amount` |
| `TRADE_COMPLETED` | 交易成功完成 | `sell_token`, `buy_token`, `trade_amount` |
| `TRADE_FAILED` | 交易失败 | `sell_token`, `buy_token`, `error_message` |
| `TOKEN_APPROVE` | 代币授权交易 | `token_symbol`, `token_address` |
| `SWAP_TOKENS` | 用户交换代币位置 | `from_token`, `to_token` |
| `SLIPPAGE_CHANGE` | 用户更改滑点设置 | `slippage_value`, `slippage_type` |

### 投资组合事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `PORTFOLIO_VIEW` | 用户查看投资组合页面 | `account_type` |
| `DEPOSIT_INITIATED` | 资金转入交易账户开始 | `amount`, `direction` |
| `DEPOSIT_COMPLETED` | 存款成功完成 | `amount`, `direction` |
| `WITHDRAW_INITIATED` | 交易转出资金账户开始 | `amount`, `direction` |
| `WITHDRAW_COMPLETED` | 提款成功完成 | `amount`, `direction` |
| `BALANCE_REFRESH` | 用户手动刷新余额 | `balance_type` |

### 协议交互事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `UNISWAP_POSITION_CREATE` | 创建新的 Uniswap 头寸 | `token_pair`, `fee_tier`, `amount` |
| `UNISWAP_LIQUIDITY_ADD` | 向头寸添加流动性 | `position_id`, `amount` |
| `UNISWAP_LIQUIDITY_REMOVE` | 从头寸移除流动性 | `position_id`, `amount` |
| `AMBIENT_POSITION_CREATE` | 创建新的 Ambient 头寸 | `token_pair`, `price_range` |
| `APRIORI_STAKE` | 在 Apriori 协议中质押代币 | `amount`, `duration` |
| `MAGMA_STAKE` | 在 Magma 协议中质押代币 | `amount`, `duration` |

### NAD Fun 事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `NAD_TOKEN_CREATE` | 在 NAD Fun 上创建新代币 | `token_symbol`, `initial_supply` |
| `NAD_TOKEN_BUY` | 在 NAD Fun 上购买代币 | `token_symbol`, `amount`, `price` |
| `NAD_TOKEN_SELL` | 在 NAD Fun 上出售代币 | `token_symbol`, `amount`, `price` |

### NAD 域名服务事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `NAD_NAME_REGISTER` | 注册新域名 | `name_length`, `registration_years` |
| `NAD_NAME_TRANSFER` | 转移域名所有权 | `name_length` |
| `NAD_NAME_SET_PRIMARY` | 设置主域名 | `name_length` |

### 通用 UI 事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `PAGE_VIEW` | 用户导航到页面 | `page_path`, `page_title` |
| `BUTTON_CLICK` | 用户点击重要按钮 | `button_type`, `context` |
| `MODAL_OPEN` | 用户打开模态框 | `modal_type` |
| `MODAL_CLOSE` | 用户关闭模态框 | `modal_type` |
| `SEARCH` | 用户执行搜索 | `search_term`, `search_context` |
| `FILTER_CHANGE` | 用户更改筛选器 | `filter_type`, `filter_value` |
| `TAB_CHANGE` | 用户切换标签页 | `from_tab`, `to_tab` |

### 错误事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `ERROR_OCCURRED` | 发生一般错误 | `error_message`, `error_context` |
| `TRANSACTION_FAILED` | 区块链交易失败 | `transaction_type`, `error_message` |

## 实现示例

### 交易页面集成

```tsx
// app/trade/trade-content.tsx
import { trackEvent, trackTrade } from '@/lib/analytics';

export function TokenContent() {
  const handleSwap = async () => {
    // 跟踪交易发起
    trackTrade('initiated', sellToken.symbol, buyToken.symbol, sellValue);
    
    try {
      // ... 交换逻辑
      
      // 跟踪成功完成
      trackTrade('completed', sellToken.symbol, buyToken.symbol, sellValue);
    } catch (error) {
      // 跟踪失败
      trackTrade('failed', sellToken.symbol, buyToken.symbol, sellValue, error.message);
    }
  };

  const handleSlippageChange = (slippage: string) => {
    trackEvent('SLIPPAGE_CHANGE', {
      event_category: 'trading',
      value: parseFloat(slippage),
      event_label: 'custom_slippage',
    });
  };
}
```

### 投资组合页面集成

```tsx
// app/odds/dashboard/portfolio/page.tsx
import { trackEvent } from '@/lib/analytics';

export default function Portfolio() {
  useEffect(() => {
    trackEvent('PORTFOLIO_VIEW', {
      event_category: 'portfolio',
      account_type: currentAccountType,
    });
  }, [currentAccountType]);
}
```

### 钱包连接集成

```tsx
// lib/web3/use-wallet-connect.ts
import { trackWalletConnection, trackEvent } from '@/lib/analytics';

export function useWalletConnect() {
  useEffect(() => {
    if (isConnected && address) {
      trackWalletConnection(address, 'EOA');
    } else if (!isConnected) {
      trackEvent('WALLET_DISCONNECT', {
        event_category: 'wallet',
      });
    }
  }, [isConnected, address]);
}
```

## 最佳实践

### 1. 隐私考虑
- 钱包地址匿名化处理（仅显示前6位和后4位字符）
- 不跟踪个人信息
- 不包含敏感交易数据

### 2. 事件命名
- 使用 `ANALYTICS_EVENTS` 常量中一致的事件名称
- 遵循模式：`对象_动作`（例如，`TRADE_COMPLETED`）
- 使用描述性事件类别

### 3. 参数标准
- 参数名称使用 snake_case
- 在 custom_parameters 中包含相关上下文
- 在类似事件中标准化通用参数

### 4. 性能
- 分析调用是非阻塞的
- 跟踪失败不影响应用功能
- 使用 @next/third-parties 对包体积影响最小

## 仪表板配置

### 推荐监控的 GA4 事件

1. **转化事件**:
   - `TRADE_COMPLETED`
   - `DEPOSIT_COMPLETED` 
   - `NAD_TOKEN_CREATE`
   - `NAD_NAME_REGISTER`

2. **参与度事件**:
   - `PORTFOLIO_VIEW`
   - `WALLET_CONNECT`
   - 关键页面会话持续时间

3. **错误事件**:
   - `TRADE_FAILED`
   - `ERROR_OCCURRED`
   - `TRANSACTION_FAILED`

### 自定义维度

考虑在 GA4 中设置这些自定义维度:

- `account_type` (EOA/DSA)
- `token_symbol`
- `protocol_name`
- `network_name`
- `error_type`

## 调试

### 本地开发

分析事件仅在以下条件满足时发送:
1. 设置了 `NEXT_PUBLIC_GA_ID` 环境变量
2. `window.gtag` 可用（由 GoogleAnalytics 组件加载）

### 测试事件

使用 Google Analytics DebugView 查看实时事件:
1. 安装 GA Debugger Chrome 扩展
2. 在浏览器中启用调试模式
3. 导航到 Analytics 仪表板中的 GA4 DebugView

### 控制台日志

添加临时日志记录以验证事件:

```typescript
export const trackEvent = (eventName, parameters) => {
  console.log('Analytics Event:', eventName, parameters); // 生产环境中移除
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', ANALYTICS_EVENTS[eventName], parameters);
  }
};
```

## 迁移说明

### 从 Universal Analytics 迁移到 GA4

如果从 UA 迁移:
1. 更新所有 `gtag('event', 'action', { ... })` 调用以使用新的参数结构
2. 用事件参数替换自定义维度
3. 更新仪表板报告以使用 GA4 事件结构

### 添加新事件

1. 在 `lib/analytics/index.ts` 的 `ANALYTICS_EVENTS` 中添加事件常量
2. 更新此文档
3. 在相关组件中实现跟踪
4. 在 GA4 DebugView 中测试

## 技术支持

分析实现问题处理:
1. 检查浏览器控制台错误
2. 验证 GA4 属性配置
3. 确保环境变量设置正确
4. 使用 GA4 DebugView 进行实时验证

## 未来增强

计划改进:
- 增强代币交易的电子商务跟踪
- 用户旅程漏斗分析
- 基于交易模式的高级分段
- 跨平台跟踪一致性