# Position Summary 指标说明

本文档解释 `components/side-drawer/common/position-summary-card.tsx` 中四个指标的来源、单位与计算公式，并给出边界处理与数据来源映射，便于后续排查与对齐业务口径。

## 概览

- 展示指标：
  - Collateral Value（抵押价值）
  - Liquidation Point（清算点）
  - Borrow Capacity（借款能力上限）
  - Available to Borrow（剩余可借额度）
- 统一单位：均以当前所选“借款代币”（`borrowTokenIndex` 指定的 `market.token0` 或 `market.token1`）计价与展示，其符号由 `displaySymbol` 提供。

## 数据来源与变量映射

- 借款代币与价格：
  - `borrowedToken = borrowTokenIndex === 0 ? market.token0 : market.token1`
  - `priceStr = borrowedToken?.price || '0'`（借款代币的 USD 价格，字符串）
- 用户 USD 聚合数据（18 位精度，需解码）：
  - `total_max_debt_in_usd` → `formatBig(..., 18)` → `totalMaxDebtUSDDec`
  - `total_debt_in_usd` → `formatBig(..., 18)` → `totalDebtUSDDec`
  - `total_collateral_in_usd` → `formatBig(..., 18)` → `totalCollateralUSDDec`
- 借款余额（所选借款代币口径）：
  - `borrowedAmount = borrowTokenIndex === 0 ? user.token0.user_debt_display_balance : user.token1.user_debt_display_balance`
- 抵押资产余额（资产口径）：
  - `userCollateralAssets = borrowTokenIndex === 0 ? user.token1.user_asset_display_balance : user.token0.user_asset_display_balance`

> 以上字段来自 `ICurvanceMarketInfo` 与 `ICurvanceMarketUserItem`，解码函数位于 `lib/utils/number.ts#formatBig`。

## 统一单位说明

- Collateral/Capacity/Available/当前债务均以“借款代币”为单位展示；从 USD 到借款代币的换算使用 `divide(usdValue, priceStr)`。
- Liquidation Point 表示“借款代币/每 1 个抵押代币”的数值，为符合直觉展示，在计算中对“抵押代币/每 1 个借款代币”结果取倒数。

## 计算公式

设：
- `priceStr` 为借款代币 USD 价格；
- `C_usd = totalCollateralUSDDec`，`D_usd = totalDebtUSDDec`，`M_usd = totalMaxDebtUSDDec`；
- `Debt_token = borrowedAmount`（当前借款代币计价的用户债务余额）；
- `Asset_collateral = userCollateralAssets`（抵押资产余额，资产口径）。

1) Collateral Value（抵押价值，借款代币单位）

```
CollateralValue_token = C_usd / priceStr
```

代码：`collateralValueInToken = isPricePositive ? divide(totalCollateralUSDDec, priceStr) : '0'`

2) Borrow Capacity（借款能力上限，借款代币单位）

```
BorrowCapacity_token = M_usd / priceStr
```

代码：`borrowCapacityInToken = isPricePositive ? divide(totalMaxDebtUSDDec, priceStr) : '0'`

3) Available to Borrow（剩余可借额度，借款代币单位）

```
Remaining_usd = max(M_usd - D_usd, 0)
Available_token = Remaining_usd / priceStr
```

代码：
- `remainingUSDDecRaw = subtract(M_usd, D_usd)`
- `remainingUSDDec = String(remainingUSDDecRaw).startsWith('-') ? '0' : remainingUSDDecRaw`
- `availableToBorrowInToken = isPricePositive ? divide(remainingUSDDec, priceStr) : '0'`

4) Liquidation Point（清算点，借款代币/每 1 个抵押代币）

- 最大抵押率（LTV_max）按资产口径计算：

```
LTV_max = M_usd / C_usd    // 当 C_usd == 0 时视为 0
```

- 先得到“抵押代币/每 1 个借款代币”的比值：

```
CollateralPerBorrowed = (Asset_collateral * LTV_max) / Debt_token
```

- 为与 UI 展示“借款代币/每 1 个抵押代币”一致，取倒数：

```
LiquidationPoint_token_per_collateral = 1 / CollateralPerBorrowed
```

代码：
- `maxCollateralRatio = C_usd === '0' ? '0' : divide(M_usd, C_usd)`
- `denomForBorrowedPrice = multiply(Asset_collateral, maxCollateralRatio)`
- `collateralPerBorrowedRaw = isDebtPositive && isDenomPositive ? divide(denomForBorrowedPrice, Debt_token) : '0'`
- `liquidationPriceBorrowedRaw = Number(collateralPerBorrowedRaw) > 0 ? divide('1', collateralPerBorrowedRaw) : '0'`
- `liquidationPriceBorrowed = String(liquidationPriceBorrowedRaw).startsWith('-') ? '0' : liquidationPriceBorrowedRaw`

## 边界与格式化处理

- 价格非正：`isPricePositive = Number(priceStr) > 0`，不满足则相关指标返回 `'0'`。
- 剩余可借为负：`remainingUSDDec` 小于 0 时夹为 `'0'`。
- 清算点的除数非正或结果为负：统一返回 `'0'`。
- 展示截断：统一使用 `truncateIfExceeds(String(x), 4)` 做 4 位小数截断（不四舍五入），保留 `displaySymbol` 作为单位符号。

## 变更记录（与历史 shares 口径的区别）

- 2025-12：将 Liquidation Point 从 shares 口径切换为资产口径（`user_asset_display_balance`），并保持单位为“借款代币/每 1 个抵押代币”。

## 参考

- 组件：`components/side-drawer/common/position-summary-card.tsx`
- 精度解码：`lib/utils/number.ts#formatBig`
- 用户/市场数据类型：`lib/data/use-curvance-market-user-info.ts`、`lib/data/use-curvance-markets.ts`

# repay 说明

- 还款需要对应币的手续费，当钱包内余额与还款额度相等时会报错